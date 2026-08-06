import { Component, OnInit, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SeoService } from '../../services/seo.service';
import { TaskService, Task as BackendTask } from '../../services/task.service';
import { AuthService, User } from '../../services/auth.service';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';


interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
}

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  currentUser: User | null = null;

  constructor(
    private seoService: SeoService,
    private taskService: TaskService,
    private authService: AuthService,
    private timeEntryService: TimeEntryService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe(user => this.currentUser = user);

    this.seoService.updateTitle('Task Management');
    this.seoService.updateMetaTags(
      'Organize, prioritize, and track your project tasks with the TimeLedger Kanban board.',
      'tasks, kanban, project management, productivity, task tracking'
    );
    this.loadTasks();
  }


  // Context Menu State
  menuVisible = false;
  menuPosition = { x: 0, y: 0 };
  selectedTask: Task | null = null;
  selectedColumn: any = null;
  selectedProject: any = null;
  menuType: 'task' | 'column' | 'project' = 'task';

  // Task Modal State
  showTaskModal = false;
  modalTask: any = {
    title: '',
    description: '',
    priority: 'medium',
    project: '',
    assignee: { name: 'Current User', avatar: 'https://i.pravatar.cc/150?u=current' },
    dueDate: '',
    columnId: 'todo'
  };
  isEditing = false;

  // Stage Modal State
  showStageModal = false;
  modalStageTitle = '';
  editingColumn: any = null;

  archivedTasks: Task[] = [];
  showArchivedDrawer = false;

  // Timer State
  isTimerRunning = false;
  timerSeconds = 0;
  timerInterval: any;
  activeTimerTask: Task | null = null;

  // Activity & Search State
  activities: any[] = [];
  showActivityDrawer = false;
  searchQuery = '';
  showSearchDrawer = false;

  submenuSide: 'right' | 'left' = 'right';

  onContextMenu(event: MouseEvent, item: any, type: 'task' | 'column' | 'project') {
    event.preventDefault();
    this.openMenu(event.clientX, event.clientY, item, type);
  }

  openMenu(x: number, y: number, item: any, type: 'task' | 'column' | 'project') {
    const board = document.querySelector('.kanbanBoard') as HTMLElement;
    const boardRect = board.getBoundingClientRect();

    // Calculate position relative to the scrollable board
    let posX = x - boardRect.left + board.scrollLeft;
    let posY = y - boardRect.top + board.scrollTop;

    const menuWidth = 240;
    const menuHeight = type === 'task' ? 300 : (type === 'column' ? 400 : 250);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Boundary check using client coordinates (x, y) relative to viewport
    if (x + menuWidth > windowWidth) {
      posX -= menuWidth;
      this.submenuSide = 'left';
    } else {
      this.submenuSide = 'right';
      if (x + menuWidth + 200 > windowWidth) {
        this.submenuSide = 'left';
      }
    }

    if (y + menuHeight > windowHeight) {
      posY -= menuHeight;
    }

    // Prevent negative coordinates
    posX = Math.max(10, posX);
    posY = Math.max(10, posY);

    this.menuPosition = { x: posX, y: posY };
    this.menuVisible = true;
    this.menuType = type;

    if (type === 'task') {
      this.selectedTask = item;
      this.selectedColumn = this.kanbanColumns.find(c => c.tasks.some(t => t.id === item.id));
      this.selectedProject = null;
    } else if (type === 'column') {
      this.selectedColumn = item;
      this.selectedTask = null;
      this.selectedProject = null;
    } else {
      this.selectedProject = item;
      this.selectedTask = null;
      this.selectedColumn = null;
    }
  }

  closeMenu() {
    this.menuVisible = false;
  }

  // Task Actions
  openTaskModal(columnId: string = 'todo', task?: Task | null) {
    this.isEditing = !!task;
    if (task) {
      this.modalTask = { ...task, columnId: columnId };
    } else {
      this.modalTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: '',
        description: '',
        priority: 'medium',
        project: 'General',
        assignee: { name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        columnId: columnId
      };
    }
    this.showTaskModal = true;
  }

  closeTaskModal() {
    this.showTaskModal = false;
  }
  saveTask() {
    if (!this.modalTask.title) return;

    let status = this.modalTask.columnId.toUpperCase();
    if (status === 'INPROGRESS') status = 'IN_PROGRESS';
    if (status === 'REVIEW') status = 'ON_HOLD'; // Map Review to ON_HOLD for now
    if (status === 'DONE') status = 'COMPLETED';

    let priority = this.modalTask.priority.toUpperCase();
    if (priority === 'CRITICAL') priority = 'URGENT';

    const bt: BackendTask = {
      title: this.modalTask.title,
      description: this.modalTask.description,
      status: status,
      priority: priority,
      dueDate: new Date().toISOString()
    };

    if (!this.currentUser) {
      alert('Please log in to manage tasks.');
      return;
    }

    if (this.isEditing) {
      this.taskService.updateTask(this.modalTask.id, bt).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (err) => {
          console.error('Failed to update task:', err);
          alert('Failed to update task. Please try again.');
        }
      });
    } else {
      this.taskService.createTask(bt).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (err) => {
          console.error('Failed to create task:', err);
          if (err.status === 401) {
            alert('Your session has expired. Please log in again.');
          } else {
            alert('Failed to create task. Please check your connection.');
          }
        }
      });
    }
  }


  // Menu Handlers
  deleteTask(task: Task | null) {
    if (!task) return;
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.loadTasks();
    });
    this.closeMenu();
  }


  archiveTask(task: Task | null) {
    if (!task) return;
    for (const column of this.kanbanColumns) {
      const index = column.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        const [archived] = column.tasks.splice(index, 1);
        (archived as any).originalColumnId = column.id;
        this.archivedTasks.push(archived);
        this.logActivity(`Archived task "${archived.title}"`, 'archive', archived.id);
        break;
      }
    }
    this.closeMenu();
  }

  unarchiveTask(task: Task) {
    const index = this.archivedTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      const [restored] = this.archivedTasks.splice(index, 1);
      const targetColumnId = (restored as any).originalColumnId || 'todo';
      const targetCol = this.kanbanColumns.find(c => c.id === targetColumnId) || this.kanbanColumns[0];
      if (targetCol) {
        targetCol.tasks.push(restored);
        this.logActivity(`Restored task "${restored.title}" to ${targetCol.title}`, 'unarchive', restored.id);
      }
    }
  }

  toggleArchivedDrawer() {
    this.showArchivedDrawer = !this.showArchivedDrawer;
  }

  toggleSearchDrawer() {
    this.showSearchDrawer = !this.showSearchDrawer;
  }

  toggleActivityDrawer() {
    this.showActivityDrawer = !this.showActivityDrawer;
  }

  logActivity(message: string, icon: string = 'info', taskId: string | null = null) {
    this.activities.unshift({
      id: Date.now(),
      message,
      icon,
      taskId,
      timestamp: new Date()
    });
  }

  // Timer Methods
  toggleTimer(task: Task | null = null) {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      this.startTimer(task);
    }
  }

  startTimer(task: Task | null = null) {
    this.activeTimerTask = task || this.selectedTask;
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
    }, 1000);
    this.logActivity(`Started timer for "${this.activeTimerTask?.title}"`, 'play_arrow', this.activeTimerTask?.id);
    this.closeMenu();
  }

  stopTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);

    const formattedTime = this.getFormattedTime();
    this.logActivity(`Stopped timer for "${this.activeTimerTask?.title}" (${formattedTime})`, 'stop', this.activeTimerTask?.id);

    // Save to Backend
    if (this.currentUser && this.currentUser.id && this.activeTimerTask) {
      const entry: TimeEntry = {
        userId: this.currentUser.id,
        taskId: this.activeTimerTask.id,
        project: this.activeTimerTask.project || 'Unassigned',
        description: `Work on task: ${this.activeTimerTask.title}`,
        startTime: new Date(Date.now() - this.timerSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: Math.ceil(this.timerSeconds / 60),
        status: 'PENDING'
      };

      this.timeEntryService.createEntry(entry).subscribe({
        next: () => console.log('Time entry saved'),
        error: (err) => console.error('Error saving time entry', err)
      });
    }

    this.timerSeconds = 0;
    this.activeTimerTask = null;
  }

  resetTimer() {
    this.stopTimer();
    this.timerSeconds = 0;
    this.activeTimerTask = null;
  }

  getFormattedTime(): string {
    const hours = Math.floor(this.timerSeconds / 3600);
    const minutes = Math.floor((this.timerSeconds % 3600) / 60);
    const seconds = this.timerSeconds % 60;
    return [hours, minutes, seconds]
      .map(v => v < 10 ? '0' + v : v)
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }

  archiveAllInColumn(column: any) {
    if (!column || !column.tasks) return;
    const tasksWithId = column.tasks.map((t: any) => ({ ...t, originalColumnId: column.id }));
    this.archivedTasks.push(...tasksWithId);
    column.tasks = [];
    this.closeMenu();
  }

  moveTaskToColumn(task: Task | null, targetColumnId: string) {
    if (!task) return;
    for (const column of this.kanbanColumns) {
      const index = column.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        const [movedTask] = column.tasks.splice(index, 1);
        const targetCol = this.kanbanColumns.find(c => c.id === targetColumnId);
        targetCol?.tasks.push(movedTask);
        break;
      }
    }
    this.closeMenu();
  }

  copyTaskLink(task: Task | null) {
    if (!task) return;
    console.log('Copying link for task:', task.id);
    this.closeMenu();
  }

  editColumn(column: any) {
    this.editingColumn = column;
    this.modalStageTitle = column.title;
    this.showStageModal = true;
    this.closeMenu();
  }

  deleteColumn(column: any) {
    const index = this.kanbanColumns.findIndex(c => c.id === column.id);
    if (index !== -1) {
      this.kanbanColumns.splice(index, 1);
    }
    this.closeMenu();
  }



  addStage() {
    this.editingColumn = null;
    this.modalStageTitle = '';
    this.showStageModal = true;
  }

  closeStageModal() {
    this.showStageModal = false;
    this.modalStageTitle = '';
    this.editingColumn = null;
  }

  saveStage() {
    if (!this.modalStageTitle) return;

    if (this.editingColumn) {
      this.editingColumn.title = this.modalStageTitle;
    } else {
      const id = this.modalStageTitle.toLowerCase().replace(/\s+/g, '-');
      this.kanbanColumns.push({
        id: id,
        title: this.modalStageTitle,
        tasks: []
      });
    }
    this.closeStageModal();
  }

  // Project Actions
  archiveProject() {
    console.log('Archiving project...');
    this.closeMenu();
  }

  deleteProject() {
    console.log('Deleting project...');
    this.closeMenu();
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.kanbanColumns, event.previousIndex, event.currentIndex);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedTask = event.container.data[event.currentIndex];
      const targetCol = this.kanbanColumns.find(c => c.tasks === event.container.data);
      if (targetCol && movedTask) {
        this.logActivity(`Moved "${movedTask.title}" to ${targetCol.title}`, 'swap_horiz', movedTask.id);
      }
    }
  }


  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      // Clear existing tasks in columns
      this.kanbanColumns.forEach(col => col.tasks = []);

      tasks.forEach(bt => {
        let priority = bt.priority?.toLowerCase() || 'medium';
        if (priority === 'urgent') priority = 'critical';

        const task: Task = {
          id: bt.id?.toString() || '',
          title: bt.title,
          description: bt.description,
          priority: priority as any,
          project: 'General', // Backend doesn't have project yet
          assignee: bt.assignee ? { name: bt.assignee.fullName, avatar: bt.assignee.avatar || 'https://i.pravatar.cc/150?u=' + bt.assignee.username } : { name: 'Unassigned', avatar: '' },
          dueDate: bt.dueDate ? new Date(bt.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : ''
        };

        let columnId = bt.status?.toLowerCase() || 'todo';
        if (columnId === 'in_progress') columnId = 'inprogress';
        if (columnId === 'completed') columnId = 'done';
        if (columnId === 'on_hold') columnId = 'review';

        const column = this.kanbanColumns.find(c => c.id === columnId) || this.kanbanColumns[0];
        column.tasks.push(task);
      });
    });
  }







  kanbanColumns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [] as Task[]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [] as Task[]
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [] as Task[]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [] as Task[]
    }
  ];

  getPriorityClass(priority: string): string {
    return 'priority-' + priority;
  }

  get pendingCount(): number {
    const todo = this.kanbanColumns.find(c => c.id === 'todo')?.tasks.length || 0;
    const review = this.kanbanColumns.find(c => c.id === 'review')?.tasks.length || 0;
    return todo + review;
  }

  get activeCount(): number {
    return this.kanbanColumns.find(c => c.id === 'inprogress')?.tasks.length || 0;
  }

  get completedCount(): number {
    return this.kanbanColumns.find(c => c.id === 'done')?.tasks.length || 0;
  }

  get searchResults(): Task[] {
    if (!this.searchQuery.trim()) return [];
    const query = this.searchQuery.toLowerCase();
    const results: Task[] = [];

    this.kanbanColumns.forEach(column => {
      column.tasks.forEach(task => {
        if (task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.project.toLowerCase().includes(query)) {
          results.push(task);
        }
      });
    });

    return results;
  }

  scrollToTask(task: Task) {
    const element = document.getElementById('task-' + task.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-task');
      setTimeout(() => element.classList.remove('highlight-task'), 2000);
    }
    this.showSearchDrawer = false;
  }
}
