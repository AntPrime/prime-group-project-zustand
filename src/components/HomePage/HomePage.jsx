import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button, Box } from '@mui/material';

function HomePage() {
  return (
    <Container 
  maxWidth="xl"
  sx={{ paddingBottom: 4, mx: 'auto' }}
>
  <img 
    src="images/LMRHorizontal-1.png" 
    alt="LMR Logo" 
    style={{ width: '40%', marginTop: '16px', marginBottom: '50px' }}
  />

  <Typography variant="h2" sx={{ marginBottom: 5, fontWeight: 'bold', fontSize: '2rem'}}>
    Sign up for upcoming school events
  </Typography>

  <Typography variant="body1" sx={{ marginBottom: 4, fontSize: '1rem', lineHeight: 1.6 }}>
    Want to help out at the next big game or school activity? You can apply for volunteer and staff roles for upcoming school events directly with LMR!
    <br />
    Whether you’re volunteering, attending, or just cheering from the sidelines, let’s get involved!
  </Typography>      

  <Grid container spacing={4} alignItems="stretch">
    {/* Card 1 */}
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          sx={{ height: 250, objectFit: 'cover', padding: 1, marginTop: 1 }}
          image=""
          title="Look up your school"
        />
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Look up your school
          </Typography>
          <Typography variant="body2" color="textSecondary">
            See what events are happening at your school, event info, and sign-up listings below.
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Card 2 */}
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          sx={{ height: 250, objectFit: 'cover', padding: 1, marginTop: 1 }}
          image="images/Screenshot 2025-04-12 at 7.29.32 PM.png"
          title="Track attended events"
        />
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Track your attended events
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Keep a record of everything you’ve helped with and attended on your student account page.
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Card 3 */}
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          sx={{ height: 250, objectFit: 'cover', padding: 1, marginTop: 1 }}
          image="images/Streaming.png"
          title="Streaming Channels"
        />
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Check out our streaming channels
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            Want to catch up on local sports like Football, Volleyball, or Soccer? 
            LMR streams games and events from around the community, so you can watch and support your team!
          </Typography>
          <Grid container spacing={1}>
            {[
              "images/FaribaultLive-Black-Text-r2wrtcvpbw0c34x7k87cafb85n4yfjoczmlw8fkdrs.webp",
              "images/albertlealive2-qsisg8i3ydb71xszn9qz9hq3u7pfnzztlr9dvbvqh0-1.webp",
              "images/NL-LOGO-BLACK-TEXT-r28x8446kpks7dnho006d7mre7n0mv4tqc0xapquv8.webp"
            ].map((src, idx) => (
              <Grid item xs={4} key={idx}>
                <CardMedia
                  component="img"
                  sx={{ height: 40, objectFit: 'contain', width: '100%' }}
                  image={src}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  </Grid>

  <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}>
    <Button 
      variant="contained" 
      href="/" 
      sx={{
        bgcolor: '#3498db',
        '&:hover': { bgcolor: '#2980b9' },
        textTransform: 'none',
        borderRadius: '2px',
        px: 3,
        py: 1.9, 
      }}
    >
      Get Involved!
    </Button>
  </Box>
</Container>

  );
}

export default HomePage;


