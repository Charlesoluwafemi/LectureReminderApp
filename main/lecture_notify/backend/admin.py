from django.contrib import admin
from .models import Faculty, Department, Lecturer, Course, Semester, Student, Lecture


admin.site.site_header = " Lecture Notify"


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'faculty', 'description')
    list_filter = ('faculty',)
    search_fields = ('name', 'faculty__name')

@admin.register(Lecturer)
class LecturerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'department')
    list_filter = ('department',)
    search_fields = ('first_name', 'last_name', 'email', 'department__name')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'course_title', 'faculty', 'department', 'lecturer', 'description')
    list_filter = ('faculty', 'department', 'lecturer')
    search_fields = ('course_code', 'faculty__name', 'department__name', 'lecturer__first_name', 'lecturer__last_name')

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date')
    search_fields = ('name',)
    ordering = ('start_date',)

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'venue', 'course_title', 'course_code', 'date', 'time')
    list_filter = ('faculty', 'venue', 'date')
    search_fields = ('course_title', 'course_code', 'faculty__name', 'venue')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'faculty', 'department')
    list_filter = ('faculty', 'department', 'faculty')
    search_fields = ('name', 'phone_number', 'faculty__name', 'department__name')
