import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

@Component({
    selector: 'app-saved-address',
    templateUrl: './saved-address.component.html',
    styleUrls: ['./saved-address.component.css'],
    standalone: false
})
export class SavedAddressComponent implements OnInit, AfterViewInit, OnDestroy {

  userId: string | null = null;

  savedAddresses: Address[] = [];
  currentAddress: Address = this.emptyAddress();
  editingIndex: number | null = null;

  map!: L.Map;
  marker!: L.Marker;

  private defaultIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  constructor(private http: HttpClient, private router:Router) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      alert('You must be logged in');
      return;
    }
    this.loadAddresses();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  emptyAddress(): Address {
    return {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      latitude: undefined,
      longitude: undefined,
    };
  }

  // loadAddresses() {
  //   this.http.get<{addresses: Address[]}>(`http://localhost:3000/user/${this.userId}/addresses`)
  //     .subscribe(res => {
  //       this.savedAddresses = res.addresses || [];
  //       if (this.savedAddresses.length > 0) {
  //         // Start editing first address by default or clear form
  //         this.editAddress(0);
  //       } else {
  //         this.resetForm();
  //       }
  //     }, err => {
  //       console.error(err);
  //       this.resetForm();
  //     });
  // }

  // initMap() {
  //   const lat = this.currentAddress.latitude ?? 20;
  //   const lng = this.currentAddress.longitude ?? 0;

  //   this.map = L.map('map').setView([lat, lng], 5);

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors'
  //   }).addTo(this.map);

  //   this.marker = L.marker([lat, lng], {
  //     draggable: true,
  //     icon: this.defaultIcon
  //   }).addTo(this.map);

  //   this.marker.on('moveend', () => {
  //     const pos = this.marker.getLatLng();
  //     this.currentAddress.latitude = pos.lat;
  //     this.currentAddress.longitude = pos.lng;
  //   });
  // }

  loadAddresses() {
    this.http.get<{addresses: Address[]}>(`http://localhost:3000/user/${this.userId}/addresses`)
      .subscribe(res => {
        this.savedAddresses = res.addresses || [];
        // Remove auto edit on load:
        // if (this.savedAddresses.length > 0) {
        //   this.editAddress(0);
        // } else {
        //   this.resetForm();
        // }
        this.resetForm(); // Just clear the form on load
      }, err => {
        this.resetForm();
      });
  }
  

  initMap() {
    const hasCoordinates = this.currentAddress.latitude != null && this.currentAddress.longitude != null;
  
    const defaultLat = this.currentAddress.latitude ?? 20;
    const defaultLng = this.currentAddress.longitude ?? 0;
  
    this.map = L.map('map').setView([defaultLat, defaultLng], 5);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    this.marker = L.marker([defaultLat, defaultLng], {
      draggable: true,
      icon: this.defaultIcon
    }).addTo(this.map);
  
    this.marker.on('moveend', () => {
      const pos = this.marker.getLatLng();
      this.currentAddress.latitude = pos.lat;
      this.currentAddress.longitude = pos.lng;
    });
  
    // Try geolocation if no coordinates yet
    if (!hasCoordinates && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.currentAddress.latitude = lat;
          this.currentAddress.longitude = lng;
          this.map.setView([lat, lng], 13);
          this.marker.setLatLng([lat, lng]);
        },
        () => {
          console.warn('User denied location or error.');
        }
      );
    }
  }
  

  updateMarkerPosition() {
    if (this.currentAddress.latitude != null && this.currentAddress.longitude != null) {
      this.marker.setLatLng([this.currentAddress.latitude, this.currentAddress.longitude]);
      this.map.setView([this.currentAddress.latitude, this.currentAddress.longitude], 13);
    }
  }

  // saveAddress() {
  //   // Validate required fields (simple)
  //   if (!this.currentAddress.street || !this.currentAddress.city || !this.currentAddress.state) {
  //     alert('Please fill at least Street, City, and State');
  //     return;
  //   }

  //   if (this.editingIndex !== null) {
  //     // Update existing
  //     this.savedAddresses[this.editingIndex] = {...this.currentAddress};
  //   } else {
  //     // Add new
  //     this.savedAddresses.push({...this.currentAddress});
  //   }

  //   this.http.put(`http://localhost:3000/user/${this.userId}/addresses`, { addresses: this.savedAddresses })
  //     .subscribe(() => {
  //       alert('Address saved successfully!');
  //       this.resetForm();
  //     }, () => alert('Failed to save address'));
  // }

  saveAddress() {
    if (!this.currentAddress.street || !this.currentAddress.city || !this.currentAddress.state) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Data',
        text: 'Please fill at least Street, City, and State',
      });
      return;
    }
  
    if (this.editingIndex !== null) {
      // Update existing
      this.savedAddresses[this.editingIndex] = { ...this.currentAddress };
    } else {
      // Add new
      this.savedAddresses.push({ ...this.currentAddress });
    }
  
    this.http.put(`http://localhost:3000/user/${this.userId}/addresses`, { addresses: this.savedAddresses })
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Address saved successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.resetForm();
      }, () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save address',
        });
      });
  }

  editAddress(index: number) {
    this.editingIndex = index;
    this.currentAddress = {...this.savedAddresses[index]};
    setTimeout(() => {
      this.map.setView([this.currentAddress.latitude ?? 20, this.currentAddress.longitude ?? 0], 13);
      this.updateMarkerPosition();
    }, 300);
  }
  

  // deleteAddress(index: number) {
  //   if (!confirm('Are you sure you want to delete this address?')) return;
  //   this.savedAddresses.splice(index, 1);
  //   this.http.put(`http://localhost:3000/user/${this.userId}/addresses`, { addresses: this.savedAddresses })
  //     .subscribe(() => {
  //       alert('Address deleted');
  //       // Clear the form instead of editing another address
  //       this.resetForm();
  //     }, () => alert('Failed to delete address'));
  // }

  deleteAddress(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this address?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.savedAddresses.splice(index, 1);
        this.http.put(`http://localhost:3000/user/${this.userId}/addresses`, { addresses: this.savedAddresses })
          .subscribe(() => {
            Swal.fire(
              'Deleted!',
              'Address has been deleted.',
              'success'
            );
            this.resetForm();
          }, () => {
            Swal.fire(
              'Failed!',
              'Failed to delete address.',
              'error'
            );
          });
      }
    });
  }
  
  

  // resetForm() {
  //   this.currentAddress = this.emptyAddress();
  //   this.editingIndex = null;
  //   setTimeout(() => {
  //     this.map.setView([20, 0], 5);
  //     this.marker.setLatLng([20, 0]);
  //   }, 300);
  // }

  resetForm() {
    this.currentAddress = this.emptyAddress();
    this.editingIndex = null;
  
    // Try to use browser's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
  
          this.currentAddress.latitude = lat;
          this.currentAddress.longitude = lng;
  
          this.map.setView([lat, lng], 13);
          this.marker.setLatLng([lat, lng]);
        },
        (err) => {
          const fallbackLat = 20;
          const fallbackLng = 0;
          this.map.setView([fallbackLat, fallbackLng], 5);
          this.marker.setLatLng([fallbackLat, fallbackLng]);
        }
      );
    } else {
      // Browser doesn't support geolocation
      const fallbackLat = 20;
      const fallbackLng = 0;
      this.map.setView([fallbackLat, fallbackLng], 5);
      this.marker.setLatLng([fallbackLat, fallbackLng]);
    }
  }

  useCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        this.currentAddress.latitude = lat;
        this.currentAddress.longitude = lng;
  
        this.map.setView([lat, lng], 15);
        this.marker.setLatLng([lat, lng]);
  
        // Call reverse geocoding API
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  
        this.http.get<any>(url).subscribe(
          (res) => {
            const address = res.address;
  
            this.currentAddress.street = address.road || '';
            this.currentAddress.city = address.city || address.town || address.village || '';
            this.currentAddress.state = address.state || '';
            this.currentAddress.country = address.country || '';
            this.currentAddress.postalCode = address.postcode || '';
          },
          (err) => {
            alert('Could not fetch address from location.');
          }
        );
      },
      (error) => {
        alert('Could not get your location. Please enable location services.');
      }
    );
  }
  
 
  goBack() {
    this.router.navigate(['/home']);
  }
}
