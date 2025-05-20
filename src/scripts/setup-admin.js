import('node-fetch').then(({ default: fetch }) => {
  require('dotenv').config();

  async function setupAdmin() {
    try {
      const response = await fetch('http://localhost:3000/api/auth/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secretKey: process.env.ADMIN_SETUP_KEY,
        }),
      });

      const data = await response.json();
      console.log('\n=== Admin Setup Results ===');
      console.log(data);
      console.log('\nIf successful, you can now login with:');
      console.log('Email:', data.credentials?.email);
      console.log('Password:', data.credentials?.password);
      console.log('\nPlease save these credentials securely!');
    } catch (error) {
      console.error('Error setting up admin:', error);
    }
  }

  setupAdmin();
}); 