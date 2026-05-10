import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  roles = ['Admin', 'PM', 'Team', 'Client'];

  showAddMemberModal = false;
  newMember: any = { name: '', email: '', role: 'Team', team: '' };
  searchQuery = '';
  isSearchActive = false;
  isLoading = true;

  @ViewChild('searchInput') searchInput!: ElementRef;
  currentUser: any;

  constructor(private teamService: TeamService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading = true;
    this.teamService.getAllTeams().subscribe({
      next: (teams: Team[]) => {
        this.fullTeams = teams;
        this.teams = teams.map((t: Team) => t.name);
        if (this.teams.length > 0) this.newMember.team = this.teams[0];
        
        // Flatten members for the UI display
        this.members = [];
        teams.forEach((t: Team) => {
          t.members.forEach((m: BackendMember) => {
            // Check if member already added (since user can be in multiple teams)
            if (!this.members.find(em => em.id === m.id.toString())) {
              this.members.push({
                id: m.id.toString(),
                name: m.fullName,
                email: m.email,
                role: m.role || 'Team',
                team: t.name,
                avatar: m.avatar || `https://i.pravatar.cc/150?u=${m.username}`,
                status: 'Offline' // Default
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

  addMember() {
    const selectedTeam = this.fullTeams.find(t => t.name === this.newMember.team);
    if (!selectedTeam || !selectedTeam.id) {
      alert('Please select a valid team');
      return;
    }

    if (this.newMember.bulkEmails) {
      const emails = this.newMember.bulkEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e);
      emails.forEach((email: string) => {
        this.teamService.inviteMember(selectedTeam.id!, email).subscribe({
          next: () => console.log(`Invited ${email}`),
          error: (err) => console.error(`Error inviting ${email}`, err)
        });
      });
      alert(`${emails.length} invitations sent!`);
    } else if (this.newMember.email) {
      this.teamService.inviteMember(selectedTeam.id, this.newMember.email).subscribe({
        next: () => {
          alert(`Invitation sent to ${this.newMember.email}!`);
          this.loadTeams(); // Refresh
        },
        error: (err) => alert(`Error: ${err.error || 'User not found'}`)
      });
    }
    
    this.showAddMemberModal = false;
    this.newMember = { name: '', email: '', role: 'Team', team: this.teams[0] || '', bulkEmails: '' };
  }

  deleteMember(id: string) {
    this.members = this.members.filter(m => m.id !== id);
    // Call backend if needed: this.teamService.removeMember(...)
  }

  getRoleClass(role: string): string {
    return 'role-' + (role ? role.toLowerCase() : 'team');
  }
}
