-- Update admin password to bcrypt hash of '123456789'
UPDATE admin SET admin_password = '$2a$10$3vy.RVz6qVSrqxOjElPEeOy8J1QyWWLOgn4xs1tH11yByqgF5hBWW' WHERE admin_email = 'admin_fury@gmail.com';
