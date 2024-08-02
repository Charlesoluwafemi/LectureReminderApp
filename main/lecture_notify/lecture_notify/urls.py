from django.urls import path, include
from django.contrib import admin
from backend.views import root_view
from backend.views import upload_students
from backend.views import UploadExcelView,CSRFView
from backend.views import login_view  
from backend.views import register_admin_user

from backend.views import upload_faculties, upload_departments, upload_lecturers, upload_courses



urlpatterns = [
    path('admin/', admin.site.urls),
    path('backend/', include('backend.urls')),
    path('upload-lecture/', UploadExcelView.as_view(), name='upload_lecture'),
    path('csrf/', CSRFView.as_view(), name='csrf'),
    path('', root_view, name='root'),  # Define a view for the root path
    path('upload-students/', upload_students, name='upload_students'),
    path('api/login/', login_view, name='login_view'),
    path('api/register/', register_admin_user, name='register_admin_user'),
    path('api/upload/faculties/', upload_faculties, name='upload_faculties'),
    path('api/upload/departments/', upload_departments, name='upload_departments'),
    path('api/upload/lecturers/', upload_lecturers, name='upload_lecturers'),
    path('api/upload/courses/', upload_courses, name='upload_courses'),
    # other paths
    # Other URL patterns as needed
    # Other URL patterns as needed
]
