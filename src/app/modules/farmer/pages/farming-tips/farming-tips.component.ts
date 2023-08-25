import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FarmingTipsService } from 'src/app/shared/services/farming-tips/farming-tips.service';

@Component({
  selector: 'app-farming-tips',
  templateUrl: './farming-tips.component.html',
  styleUrls: ['./farming-tips.component.scss'],
})
export class FarmingTipsComponent implements OnInit {
  tips: any = [];
  searchTerm: String = '';
  
  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private farmingTipsService: FarmingTipsService
  ) {}

  ngOnInit(): void {
    this.getAllFarmingTips();

    this.route.params.subscribe((params) => {
      if (params['searchTerm']) this.searchTerm = params['searchTerm'];
    });
  }

  getAllFarmingTips = () => {
    this.farmingTipsService.getAllFarmingTips().subscribe((data: any) => {
      this.tips = data;
      console.log(data);
    });
  };

  search(): void {
    if (this.searchTerm)
      this._router.navigateByUrl('/menu/categories/search' + this.searchTerm);
  }
}
