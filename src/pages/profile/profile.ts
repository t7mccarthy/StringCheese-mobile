import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { HomePage } from '../home/home';
import { BrowsePage } from '../browse/browse';
import { DonationsPage } from '../donations/donations';
import { Donation } from '../../models/donation';
import { EditPage } from '../edit/edit';
import { User } from '../../models/user';
import { Http } from '@angular/http';
import { ConfigService } from '../../config.service';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public user: User = new User();
  jwt: string;
  public donations: Array<Donation> = [];
  public total: number = 0;
  public mem_status: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, public http: Http, public configService: ConfigService) {
    this.jwt = localStorage.getItem('jwt')

    this.http
      .get(this.configService.getBaseUrl() + "/users", {
        params: {
          jwt: this.jwt
        }
      })
      .subscribe(
        result => {
          let newUser = result.json().user;
          this.user = newUser;

          this.http
            .get(this.configService.getBaseUrl() + "/donations", {
              params: {
                jwt: this.jwt
              }
            })
            .subscribe(
              result => {
                this.donations = result.json();
                for (let i = 0; i < this.donations.length; i++) {
                  this.total += this.donations[i].amount;
                }

                if (this.total < 100){
                  this.mem_status = "bronze toucan member";
                }
                else if (this.total < 500){
                  this.mem_status = "silver toucan member";
                }
                else if (this.total < 1000){
                  this.mem_status = "gold toucan member";
                }
                else if (this.total < 10000){
                  this.mem_status = "platinum toucan member";
                }
                else if (this.total < 100000){
                  this.mem_status = "toucan saviour";
                }
                else if (this.total > 100000){
                  this.mem_status = "toucan god";
                }

              },
              error => {
                console.log(error);
              }

            );
        },
        error => {
          console.log(error);
        }

      );
  }
  // if (this.navParams.get('user')) {
  //   let user = this.navParams.get('user');
  // }

  // navigateToHome() {
  //   this.navCtrl.push(HomePage, {
  //     user: this.user,
  //   });
  // }

  navigateToHome() {
    localStorage.clear();
  }

  logOut() {
    localStorage.clear();
    this.app.getRootNav().setRoot(HomePage);
  }

  navigateToBrowse() {
    this.navCtrl.push(BrowsePage, {
      user: this.user,
    });
  }

  navigateToEdit() {
    this.navCtrl.push(EditPage, {
      user: this.user,
    });
  }

  navigateToDonations() {
    this.navCtrl.push(DonationsPage, {
      user: this.user,
    });
  }

  navigateToProfile() {
    this.navCtrl.push(ProfilePage, {
      user: this.user,
    });
  }

}
