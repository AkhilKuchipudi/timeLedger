import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TeamService, Team, Member as BackendMember } from '../../services/team.service';
import { AuthService } from '../../services/auth.service';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'Away';
}

@Component({
  selector: 'app-teams',
  standalone: false,
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  members: Member[] = [];
  teams: string[] = [];
  fullTeams: Team[] = [];
  roles = ['ROLE_ADMIN', 'ROLE_PM', 'ROLE_USER', 'ROLE_CLIENT'];

  showAddMemberModal = false;
  newMember: any = { name: '', email: '', role: 'ROLE_USER', team: '' };
  searchQuery = '';
  isSearchActive = false;
  isLoading = true;
  isSending = false;

  // Edit modal
  showEditModal = false;
  editingMember: Member | null = null;
  editForm: { name: string; email: string } = { name: '', email: '' };
  isSavingEdit = false;

  // Perms modal
  showPermsModal = false;
  permsMember: Member | null = null;
  permsRole = '';
  isSavingPerms = false;

  // Custom Dropdowns
  isAddRoleDropdownOpen = false;
  isAddTeamDropdownOpen = false;
  isPermsRoleDropdownOpen = false;

  // Toast
  toast: { message: string; type: 'success' | 'error' } | null = null;

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3500);
  }

  selectAddRole(role: string) {
    this.newMember.role = role;
    this.isAddRoleDropdownOpen = false;
  }

  selectAddTeam(team: string) {
    this.newMember.team = team;
    this.isAddTeamDropdownOpen = false;
  }

  selectPermsRole(role: string) {
    this.permsRole = role;
    this.isPermsRoleDropdownOpen = false;
  }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.isAddRoleDropdownOpen = false;
    this.isAddTeamDropdownOpen = false;
    this.isPermsRoleDropdownOpen = false;
  }

  @ViewChild('searchInput') searchInput!: ElementRef;
  currentUser: any;

  constructor(private teamService: TeamService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.loadTeams();
  }

  getMemberInitials(name: string): string {
    return (name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  getInitialsColor(name: string): string {
    const colors = [
      '#7c3aed', '#0891b2', '#059669', '#d97706',
      '#dc2626', '#db2777', '#7c3aed', '#0284c7'
    ];
    let hash = 0;
    for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  loadTeams() {
    this.isLoading = true;
    this.teamService.getAllTeams().subscribe({
      next: (teams: Team[]) => {
        this.fullTeams = teams;
        this.teams = teams.map((t: Team) => t.name);
        if (this.teams.length > 0) this.newMember.team = this.teams[0];
        
        this.members = [];
        teams.forEach((t: Team) => {
          t.members.forEach((m: BackendMember) => {
            if (!this.members.find(em => em.id === m.id.toString())) {
              this.members.push({
                id: m.id.toString(),
                name: m.fullName,
                email: m.email,
                role: m.role || 'ROLE_USER',
                team: t.name,
                avatar: '',
                status: 'Offline'
              });
            }
          });
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading teams', err);
        this.isLoading = false;
      }
    });
  }

  get filteredMembers(): Member[] {
    if (!this.searchQuery) return this.members;
    const query = this.searchQuery.toLowerCase();
    return this.members.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query) || 
      m.role.toLowerCase().includes(query) || 
      m.team.toLowerCase().includes(query)
    );
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      setTimeout(() => {
        if (this.searchInput) this.searchInput.nativeElement.focus();
      }, 300);
    } else {
      this.searchQuery = '';
    }
  }

  openAddMember() {
    this.showAddMemberModal = true;
  }

  // ── Edit Member ──
  openEditModal(member: Member) {
    this.editingMember = member;
    this.editForm = { name: member.name, email: member.email };
    this.showEditModal = true;
  }

  saveEdit() {
    if (!this.editingMember) return;
    this.isSavingEdit = true;
    this.authService.updateUserProfile(+this.editingMember.id, this.editForm.name, this.editForm.email).subscribe({
      next: (updated: any) => {
        const m = this.members.find(m => m.id === this.editingMember!.id);
        if (m) {
          m.name = updated.fullName || this.editForm.name;
          m.email = updated.email || this.editForm.email;
        }
        this.showToast('Member profile updated successfully!', 'success');
        this.showEditModal = false;
        this.isSavingEdit = false;
        this.editingMember = null;
      },
      error: (err: any) => {
        this.showToast(`Failed to update: ${err.error || 'Server error'}`, 'error');
        this.isSavingEdit = false;
      }
    });
  }

  // ── Permissions (Role) ──
  openPermsModal(member: Member) {
    this.permsMember = member;
    this.permsRole = member.role;
    this.showPermsModal = true;
  }

  savePerms() {
    if (!this.permsMember) return;
    this.isSavingPerms = true;
    this.authService.updateUserRole(+this.permsMember.id, this.permsRole).subscribe({
      next: (updated: any) => {
        const m = this.members.find(m => m.id === this.permsMember!.id);
        if (m) m.role = updated.role || this.permsRole;
        this.showToast(`Role updated to ${this.permsRole}`, 'success');
        this.showPermsModal = false;
        this.isSavingPerms = false;
        this.permsMember = null;
      },
      error: (err: any) => {
        this.showToast(`Failed to update role: ${err.error || 'Server error'}`, 'error');
        this.isSavingPerms = false;
      }
    });
  }

  addMember() {
    const selectedTeam = this.fullTeams.find(t => t.name === this.newMember.team);
    if (!selectedTeam || !selectedTeam.id) {
      this.showToast('Please select a valid team', 'error');
      return;
    }
    this.isSending = true;

    if (this.newMember.bulkEmails) {
      const emails = this.newMember.bulkEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e);
      let completed = 0;
      emails.forEach((email: string) => {
        this.teamService.inviteMember(selectedTeam.id!, email).subscribe({
          next: () => {
            completed++;
            if (completed === emails.length) {
              this.showToast(`${emails.length} invitation(s) sent successfully!`, 'success');
              this.isSending = false;
              this.loadTeams();
            }
          },
          error: () => {
            this.showToast(`Failed to invite ${email}: user not found`, 'error');
            this.isSending = false;
          }
        });
      });
    } else if (this.newMember.email) {
      this.teamService.inviteMember(selectedTeam.id, this.newMember.email).subscribe({
        next: () => {
          this.showToast(`Invitation sent to ${this.newMember.email}!`, 'success');
          this.isSending = false;
          this.loadTeams();
        },
        error: () => {
          this.showToast(`Error: User not found with email "${this.newMember.email}"`, 'error');
          this.isSending = false;
        }
      });
    } else {
      this.showToast('Please enter an email address', 'error');
      this.isSending = false;
      return;
    }

    this.showAddMemberModal = false;
    this.newMember = { name: '', email: '', role: 'ROLE_USER', team: this.teams[0] || '', bulkEmails: '' };
  }

  deleteMember(id: string) {
    this.members = this.members.filter(m => m.id !== id);
  }

  getRoleClass(role: string): string {
    return 'role-' + (role ? role.toLowerCase().replace('role_', '') : 'user');
  }
}


