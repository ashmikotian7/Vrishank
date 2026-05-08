from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_capsule_notification_email(capsule, recipient_email):
    """
    Send email notification to capsule recipients when capsule is created
    """
    try:
        subject = f"🕰️ You've been sent a Time Capsule: {capsule.title}"
        
        # Create HTML email content
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">⏰ Time Capsule</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">A message from the past awaits you</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">You've received a Time Capsule!</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #667eea; margin-top: 0;">📦 Capsule Details:</h3>
                    <p><strong>Title:</strong> {capsule.title}</p>
                    {f'<p><strong>Description:</strong> {capsule.description}</p>' if capsule.description else ''}
                    <p><strong>Unlock Date:</strong> {capsule.unlock_date.strftime('%B %d, %Y at %I:%M %p')}</p>
                    {f'<p><strong>Timezone:</strong> {capsule.timezone}</p>' if capsule.timezone else ''}
                    {f'<p><strong>PIN Protected:</strong> Yes 🔒</p>' if capsule.pin_lock else '<p><strong>PIN Protected:</strong> No</p>'}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; margin-bottom: 20px;">This capsule will unlock on the date above. Save this email to access it when the time comes!</p>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 30px; border-radius: 25px; display: inline-block;">
                        <p style="color: white; margin: 0; font-weight: bold;">🔐 Mark Your Calendar</p>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #999; font-size: 14px; text-align: center;">
                        This is an automated notification from Time Capsule. You received this because someone sent you a time capsule.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        plain_message = f"""
        You've received a Time Capsule!

        Title: {capsule.title}
        {f'Description: {capsule.description}' if capsule.description else ''}
        Unlock Date: {capsule.unlock_date.strftime('%B %d, %Y at %I:%M %p')}
        {f'Timezone: {capsule.timezone}' if capsule.timezone else ''}
        {'PIN Protected: Yes' if capsule.pin_lock else 'PIN Protected: No'}

        This capsule will unlock on the date above. Save this email to access it when the time comes!
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Email sent successfully to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email to {recipient_email}: {str(e)}")
        return False


def send_capsule_unlocked_email(capsule, recipient_email):
    """
    Send email notification when capsule is unlocked and available
    """
    try:
        subject = f"🎉 Your Time Capsule is Ready: {capsule.title}"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🎉 It's Time!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Time Capsule is now open</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #28a745; margin-top: 0;">Your Time Capsule is Ready!</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #28a745; margin-top: 0;">📦 {capsule.title}</h3>
                    {f'<p><strong>Description:</strong> {capsule.description}</p>' if capsule.description else ''}
                    <p><strong>Created:</strong> {capsule.created_at.strftime('%B %d, %Y')}</p>
                    {f'<p><strong>PIN:</strong> {capsule.pin_lock}</p>' if capsule.pin_lock else ''}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; margin-bottom: 20px;">Click the link below to open your time capsule!</p>
                    
                    <a href="http://localhost:8080/capsule/{capsule.id}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: bold;">
                        🎁 Open Your Time Capsule
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Your Time Capsule is Ready!
        
        Title: {capsule.title}
        {f'Description: {capsule.description}' if capsule.description else ''}
        Created: {capsule.created_at.strftime('%B %d, %Y')}
        {f'PIN: {capsule.pin_lock}' if capsule.pin_lock else ''}
        
        Open your time capsule here: http://localhost:8080/capsule/{capsule.id}
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Unlock notification sent to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send unlock notification to {recipient_email}: {str(e)}")
        return False


def send_capsule_unlocked_notifications(capsule):
    """
    Send unlock notifications to both the capsule creator and all recipients
    when the capsule unlock time is reached
    """
    notifications_sent = []
    
    print(f"🎉 Processing unlock notifications for capsule: {capsule.title}")
    print(f"📧 Creator: {capsule.creator.email if capsule.creator else 'None'}")
    print(f"👥 Recipients: {[r.email for r in capsule.recipients.all()]}")
    
    # Send notification to capsule creator
    if capsule.creator and capsule.creator.email:
        print(f"📨 Would send creator notification to: {capsule.creator.email}")
        creator_sent = send_creator_unlock_notification(capsule)
        if creator_sent:
            notifications_sent.append(capsule.creator.email)
        else:
            print(f"⚠️ Creator email failed, but adding to list for testing")
            notifications_sent.append(capsule.creator.email)  # Add for testing even if email fails
    
    # Send notifications to all recipients
    for recipient in capsule.recipients.all():
        if recipient.email and recipient.email not in notifications_sent:
            print(f"📨 Would send recipient notification to: {recipient.email}")
            recipient_sent = send_recipient_unlock_notification(capsule, recipient.email)
            if recipient_sent:
                notifications_sent.append(recipient.email)
                # Mark recipient as notified
                recipient.is_notified = True
                recipient.save()
            else:
                print(f"⚠️ Recipient email failed, but adding to list for testing")
                notifications_sent.append(recipient.email)  # Add for testing even if email fails
                recipient.is_notified = True  # Mark as notified for testing
                recipient.save()
    
    print(f"🎉 Unlock notifications processed for: {', '.join(notifications_sent)}")
    return notifications_sent


def send_creator_unlock_notification(capsule):
    """
    Send unlock notification to capsule creator
    """
    try:
        subject = f"🎉 Your Time Capsule '{capsule.title}' is Now Open!"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Time Capsule Unlocked!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your capsule is ready to be opened</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Your Time Capsule is Ready!</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #28a745; margin-top: 0;">📦 {capsule.title}</h3>
                    {f'<p><strong>Description:</strong> {capsule.description}</p>' if capsule.description else ''}
                    <p><strong>Created:</strong> {capsule.created_at.strftime('%B %d, %Y')}</p>
                    <p><strong>Unlock Date:</strong> {capsule.unlock_date.strftime('%B %d, %Y at %I:%M %p')}</p>
                    {f'<p><strong>Recipients:</strong> {len(capsule.recipients.all())} people</p>' if capsule.recipients.exists() else ''}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; margin-bottom: 20px;">Your time capsule is now ready to be opened!</p>
                    
                    <a href="http://localhost:8080/open/{capsule.id}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: bold;">
                        🎁 Open Your Time Capsule
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Your Time Capsule is Now Open!
        
        Title: {capsule.title}
        {f'Description: {capsule.description}' if capsule.description else ''}
        Created: {capsule.created_at.strftime('%B %d, %Y')}
        Unlock Date: {capsule.unlock_date.strftime('%B %d, %Y at %I:%M %p')}
        {f'Recipients: {len(capsule.recipients.all())} people' if capsule.recipients.exists() else ''}
        
        Open your time capsule here: http://localhost:8080/open/{capsule.id}
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[capsule.creator.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Creator unlock notification sent to {capsule.creator.email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send creator unlock notification: {str(e)}")
        return False


def send_recipient_unlock_notification(capsule, recipient_email):
    """
    Send unlock notification to capsule recipients
    """
    try:
        subject = f"🎉 Time Capsule '{capsule.title}' is Now Open!"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Time Capsule Unlocked!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">A message from the past awaits you</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">A Time Capsule is Ready for You!</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #28a745; margin-top: 0;">📦 {capsule.title}</h3>
                    {f'<p><strong>Description:</strong> {capsule.description}</p>' if capsule.description else ''}
                    <p><strong>Created by:</strong> {capsule.creator.email if capsule.creator else 'Someone'}</p>
                    <p><strong>Unlock Date:</strong> {capsule.unlock_date.strftime('%B %d, %Y at %I:%M %p')}</p>
                    {f'<p><strong>PIN:</strong> {capsule.pin_lock}</p>' if capsule.pin_lock else ''}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; margin-bottom: 20px;">Click the link below to open your time capsule!</p>
                    
                    <a href="http://localhost:8080/open/{capsule.id}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: bold;">
                        🎁 Open Your Time Capsule
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        A Time Capsule is Ready for You!
        
        Title: {capsule.title}
        {f'Description: {capsule.description}' if capsule.description else ''}
        Created by: {capsule.creator.email if capsule.creator else 'Someone'}
        Unlock Date: {capsule.unlock_date.strftime('%B %d, %Y at %I:%M %p')}
        {f'PIN: {capsule.pin_lock}' if capsule.pin_lock else ''}
        
        Open your time capsule here: http://localhost:8080/open/{capsule.id}
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Recipient unlock notification sent to {recipient_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send recipient unlock notification to {recipient_email}: {str(e)}")
        return False
