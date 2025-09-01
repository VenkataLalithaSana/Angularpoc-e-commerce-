import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css'],
    standalone: false
})
export class EditProfileComponent {
  user: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage after login
    this.http.get(`http://localhost:3000/user/${userId}`).subscribe(data => {
      this.user = data;      
    });
  }

  updateProfile() {
    const userId = localStorage.getItem('userId')
    localStorage.setItem('user', this.user.username); ;
    console.log("username", this.user.username);
    this.http.put(`http://localhost:3000/user/${userId}`, this.user).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully!',
          confirmButtonText: 'Okay'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/home']);
          }
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update profile. Please try again.'
        });
      }
    );
  }
}
