import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FarmingTipsService } from 'src/app/shared/services/farming-tips/farming-tips.service';

@Component({
  selector: 'app-farming-tips',
  templateUrl: './farming-tips.component.html',
  styleUrls: ['./farming-tips.component.scss'],
})
export class FarmingTipsComponent implements OnInit {
  tips: any = [];
  searchTerm: String = '';
  isEmpty = true;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private farmingTipsService: FarmingTipsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllFarmingTips();

    this.route.params.subscribe((params) => {
      if (params['searchTerm']) this.searchTerm = params['searchTerm'];
    });
  }

  getAllFarmingTips = () => {
    this.farmingTipsService.getAllFarmingTips().subscribe(
      (data: any) => {
        this.tips = data.sort((a: any, b: any) => b.tipId - a.tipId);
        this.tips = this.tips.filter((tip: any) => tip.status === true);
        if (this.tips.length > 0) {
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      },
      () => {
        this.authService.logout();
      }
    );
  };

  search(): void {
    if (this.searchTerm)
      this._router.navigateByUrl('/menu/categories/search' + this.searchTerm);
  }
}
