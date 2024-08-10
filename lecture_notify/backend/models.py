from django.db import models

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Faculty"
        verbose_name_plural = "Faculties"

class Department(models.Model):
    name = models.CharField(max_length=100)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='departments')
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.name

class Course(models.Model):
    course_code = models.CharField(max_length=10)
    course_title = models.CharField(max_length=100)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='courses')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='departmental_courses', null=True, blank=True)
    lecturer = models.ForeignKey('Lecturer', on_delete=models.CASCADE, related_name='courses', null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Course"
        
    def __str__(self):
        return self.course_title

class Lecturer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='lecturers')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lecturers', null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        verbose_name = "Lecturer"  # Capitalize the display name
        verbose_name_plural = "Lecturers"  # Capitalize the plural display name (optional)
 


    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Semester(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        verbose_name = "Semester"
        verbose_name_plural = "Semesters"

    def __str__(self):
        return self.name

class Lecture(models.Model):
    course_title = models.CharField(max_length=100)
    course_code = models.CharField(max_length=20)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    venue = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()

    class Meta:
        verbose_name = "Lecture"  # Capitalize the display name
        verbose_name_plural = "Lectures"  # Capitalize the plural display name (optional)


    def __str__(self):
        return self.course_title

class Student(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    student_id = models.CharField(max_length=20, unique=True, default='1')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='students', null=True, blank=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "Student"  # Capitalize the display name
        verbose_name_plural = "Students"  # Capitalize the plural display name (optional)


    def __str__(self):
        return self.name



