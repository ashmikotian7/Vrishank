from django.urls import path
from . import views

app_name = 'capsules'

urlpatterns = [
    # Capsule CRUD operations
    path('', views.CapsuleListCreateView.as_view(), name='capsule-list-create'),
    path('<int:pk>/', views.CapsuleDetailView.as_view(), name='capsule-detail'),
    
    # Capsule specific actions
    path('<int:pk>/seal/', views.seal_capsule, name='seal-capsule'),
    path('<int:pk>/unlock/', views.unlock_capsule, name='unlock-capsule'),
    
    # User capsule collections
    path('my-capsules/', views.my_capsules, name='my-capsules'),
    path('received-capsules/', views.received_capsules, name='received-capsules'),
    
    # Attachment management
    path('<int:capsule_pk>/attachments/', views.CapsuleAttachmentUploadView.as_view(), name='upload-attachment'),
    path('<int:pk>/attachments/<int:attachment_pk>/', views.delete_attachment, name='delete-attachment'),
]
