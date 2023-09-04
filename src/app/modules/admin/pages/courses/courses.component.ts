import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CourseService } from 'src/app/shared/services/course/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courseForm: FormGroup;
  courses: any = [];
  courseId: any;
  addDialog = false;
  isEditing = false;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.courseForm = fb.group({
      courseName: ['', Validators.required],
      ytLink: ['', Validators.required],
    });
  }

  get courseName() {
    return this.courseForm.get('courseName');
  }

  get description() {
    return this.courseForm.get('description');
  }

  get ytLink() {
    return this.courseForm.get('ytLink');
  }

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses = () => {
    this.courseService.getAllCourses().subscribe(
      (data: any) => {
        this.courses = data.sort((a: any, b: any) => b.courseId - a.courseId);
      },
      () => {
        this.authService.logout();
      }
    );
  };

  openAddCourseDialog = () => {
    this.isEditing = false;
    this.courseForm.reset();
    this.addDialog = true;
  };

  onEditCourse = (course: any) => {
    this.isEditing = true;
    this.courseForm.patchValue({
      courseName: course.courseName,
      ytLink: course.ytLink,
    });
    this.courseId = course.courseId;
    this.addDialog = true;
  };

  onSubmit = () => {
    if (this.isEditing) {
      console.log(this.courseForm.value);
      if (this.courseForm.valid) {
        console.log(this.courseId);
        this.courseService
          .updateCourse(this.courseId, this.courseForm.value)
          .subscribe(() => {
            this.getAllCourses();
            this.addDialog = false;
          });
      } else {
        this.courseForm.markAllAsTouched();
      }
    } else {
      if (this.courseForm.valid) {
        this.courseService.addCourse(this.courseForm.value).subscribe(() => {
          this.getAllCourses();
          this.addDialog = false;
        });
      } else {
        this.courseForm.markAllAsTouched();
      }
    }
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };
}
