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
      status: [true, Validators.required],
    });
  }

  get courseName() {
    return this.courseForm.get('courseName');
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
      status: course.status,
    });
    this.courseId = course.courseId;
    this.addDialog = true;
  };

  onSubmit = () => {
    const courseNameControl = this.courseForm.get('courseName');
    const statusControl = this.courseForm.get('status');

    if (courseNameControl && statusControl) {
      const coursePayload = {
        courseName: courseNameControl.value,
        status: statusControl.value,
      };

      if (this.isEditing) {
        this.courseService.updateCourse(this.courseId, coursePayload).subscribe(
          () => {
            this.getAllCourses();
            this.courseForm.reset();
            this.addDialog = false;
          },
          () => {
            this.authService.logout();
          }
        );
      } else {
        if (this.courseForm.valid) {
          this.courseService.addCourse(coursePayload).subscribe(
            () => {
              this.getAllCourses();
              this.courseForm.reset();
              this.addDialog = false;
            },
            () => {
              this.authService.logout();
            }
          );
        } else {
          this.courseForm.markAllAsTouched();
        }
      }
    }
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };
}
