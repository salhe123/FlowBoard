import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  name = '';
  message = signal('');

  submit() {
    const user = this.name.trim();
    if (!user) {
      this.message.set('Type a name first.');
      return;
    }

    sessionStorage.setItem('flowboard-user', user);
    this.message.set(`Logged in as ${user}. Next we’ll build the dashboard.`);
  }
}
