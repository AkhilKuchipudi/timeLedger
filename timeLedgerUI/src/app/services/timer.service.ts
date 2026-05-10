import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TimerState {
  isActive: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  currentTask: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private state = new BehaviorSubject<TimerState>({
    isActive: false,
    startTime: null,
    elapsedSeconds: 0,
    currentTask: 'General'
  });

  public state$ = this.state.asObservable();
  private timerSubscription: Subscription | null = null;

  constructor() {
    // Try to recover state from localStorage
    const saved = localStorage.getItem('timerState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isActive && parsed.startTime) {
        const startTime = new Date(parsed.startTime);
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        this.state.next({
          ...parsed,
          startTime,
          elapsedSeconds: diff
        });
        this.resumeTimer();
      } else {
        this.state.next(parsed);
      }
    }
  }

  startTimer(task: string) {
    const startTime = new Date();
    this.state.next({
      isActive: true,
      startTime,
      elapsedSeconds: 0,
      currentTask: task
    });
    this.saveState();
    this.resumeTimer();
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    const finalState = { ...this.state.value, isActive: false, startTime: null };
    this.state.next(finalState);
    this.saveState();
    return this.state.value.elapsedSeconds;
  }

  private resumeTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000).subscribe(() => {
      const current = this.state.value;
      if (current.startTime) {
        const now = new Date();
        const diff = Math.floor((now.getTime() - current.startTime.getTime()) / 1000);
        this.state.next({ ...current, elapsedSeconds: diff });
      }
    });
  }

  private saveState() {
    localStorage.setItem('timerState', JSON.stringify(this.state.value));
  }

  getFormattedTime(): Observable<string> {
    return this.state$.pipe(
      map(state => {
        const s = state.elapsedSeconds;
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;
        return [hours, minutes, seconds]
          .map(v => v < 10 ? '0' + v : v)
          .filter((v, i) => v !== '00' || i > 0)
          .join(':');
      })
    );
  }
}

import { Observable } from 'rxjs';
