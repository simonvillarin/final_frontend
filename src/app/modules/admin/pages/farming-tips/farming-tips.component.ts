import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FarmingTipsService } from 'src/app/shared/services/farming-tips/farming-tips.service';

@Component({
  selector: 'app-farming-tips',
  templateUrl: './farming-tips.component.html',
  styleUrls: ['./farming-tips.component.scss'],
})
export class FarmingTipsComponent {
  tipForm: FormGroup;

  tips: any = [];
  tipId: any;
  gridLayout = false;
  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;
  imagePreview: string | ArrayBuffer | null = null;
  file: any;

  constructor(
    private farmingTipsService: FarmingTipsService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.tipForm = fb.group({
      tip: ['', Validators.required],
      filename: ['', Validators.required],
      mimeType: ['', Validators.required],
      data: ['', Validators.required],
    });
  }

  get tip() {
    return this.tipForm.get('tip') as FormControl;
  }

  ngOnInit(): void {
    this.getAllFarmingTips();
  }

  getAllFarmingTips = () => {
    this.farmingTipsService.getAllFarmingTips().subscribe((data: any) => {
      this.tips = data;
    });
  };

  onFileSelected(event: any) {
    this.emptyImage = false;
    this.file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.readFileAsBytes(file);
    }

    reader.readAsDataURL(this.file);
    this.showImage = true;
  }

  readFileAsBytes(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const mimeType = file.type;
        const fileName = file.name;

        this.tipForm.patchValue({
          filename: fileName,
          mimeType: mimeType,
          data: Array.from(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  openAddTipDialog = () => {
    this.isEditing = false;
    this.tipForm.reset();
    this.emptyImage = false;
    this.showImage = false;
    this.addDialog = true;
  };

  onEditTip = (tip: any) => {
    this.isEditing = true;
    this.tipForm.patchValue({
      tip: tip.tip,
      image: tip.image,
    });
    this.tipId = tip.tipId;
    this.showImage = true;
  };

  onSubmit = () => {
    if (this.tipForm.valid) {
      this.farmingTipsService.addTip(this.tipForm.value).subscribe(() => {
        this.getAllFarmingTips();
        this.tipForm.reset();
        this.addDialog = false;
      });
    } else {
      this.tipForm.markAllAsTouched();
      this.emptyImage = true;
    }
  };

  onRemove = (tip: any) => {
    this.tipId = tip.tipId;
    this.confirmationDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onDelete = () => {
    this.farmingTipsService
      .updateTip(this.tipId, {
        status: false,
      })
      .subscribe(() => {
        this.getAllFarmingTips();
        this.confirmationDialog = false;
      });
  };
}
