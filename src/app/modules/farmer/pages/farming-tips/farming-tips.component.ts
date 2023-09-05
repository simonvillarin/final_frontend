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
  empty = true;

  search: String = '';

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private farmingTipsService: FarmingTipsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllFarmingTips();
  }

  getAllFarmingTips = () => {
    this.farmingTipsService.getAllFarmingTips().subscribe(
      (data: any) => {
        this.tips = data.sort((a: any, b: any) => b.tipId - a.tipId);
        this.tips = this.tips.filter((tip: any) => tip.status === true);
        if (this.tips.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      },
      () => {
        this.authService.logout();
      }
    );
  };

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.tips = this.tips.filter(
        (tip: any) =>
          tip.tip.toLowerCase().includes(search.toLowerCase()) ||
          tip.subject.toLowerCase().includes(search.toLowerCase())
      );
      if (this.tips.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getAllFarmingTips();
    }
  };

  onClear = () => {
    this.search = '';
    this.getAllFarmingTips();
  };
}
