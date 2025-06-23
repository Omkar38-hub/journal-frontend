import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  CircularProgress, 
  Container, 
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  SvgIcon
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function GoogleLogoIcon(props) {
  return (
    <SvgIcon {...props} width="18" height="18" viewBox="0 0 18 18">
      <g fill="none" fillRule="evenodd">
        <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1682-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7772 2.7218v2.2591h2.9082c1.7018-1.5664 2.6864-3.8727 2.6864-6.6218z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1818l-2.9082-2.2591c-.8064.5427-1.8409.8618-3.0482.8618-2.3455 0-4.3291-1.5818-5.0382-3.7127H.9573v2.3318C2.4382 16.0973 5.4818 18 9 18z" fill="#34A853"/>
        <path d="M3.9618 10.71c-.1818-.5427-.2855-1.1164-.2855-1.71s.1036-1.1673.2855-1.71V4.9582H.9573C.3473 6.1718 0 7.5473 0 9s.3473 2.8282.9573 4.0418L3.9618 10.71z" fill="#FBBC05"/>
        <path d="M9 3.5782c1.3227 0 2.5073.4555 3.44 1.3464l2.5818-2.5818C13.4636.8918 11.4255 0 9 0 5.4818 0 2.4382 1.9027.9573 4.9582L3.9618 7.29C4.6709 5.1591 6.6545 3.5782 9 3.5782z" fill="#EA4335"/>
      </g>
    </SvgIcon>
  );
}

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&prompt=consent`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/public/signup", { username, password });
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      let msg = "Signup failed. User may already exist.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          msg = err.response.data;
        } else if (err.response.data.message) {
          msg = err.response.data.message;
        }
      }
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogleSignup = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: "#f4f6f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="sm">
        <Card sx={{
          borderRadius: 4,
          boxShadow: "0 4px 12px 0 rgba(0,0,0,0.05)",
          background: "white",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 24px 0 rgba(0,0,0,0.1)",
          }
        }}>
          {/* Header Section */}
          <Box sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            p: 4,
            textAlign: "center"
          }}>
            <Avatar sx={{ 
              bgcolor: "rgba(255, 255, 255, 0.2)", 
              width: 64, 
              height: 64,
              margin: "0 auto 16px",
              backdropFilter: "blur(10px)"
            }}>
              <PersonAddOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Join us and start your journaling journey today
            </Typography>
          </Box>

          {/* Form Section */}
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ 
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { color: "#d32f2f" }
              }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ 
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { color: "#2e7d32" }
              }}>
                {success}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6366f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#6366f1",
                    },
                  },
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6366f1",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#6366f1",
                    },
                  },
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 12px 0 rgba(99, 102, 241, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px 0 rgba(99, 102, 241, 0.4)",
                    transition: "all 0.3s ease"
                  },
                  transition: "all 0.3s ease"
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Account"}
              </Button>

              <Divider sx={{ 
                my: 3,
                "&::before, &::after": {
                  borderColor: "#e2e8f0",
                }
              }}>
                <Typography variant="body2" sx={{ color: "#64748b", px: 2 }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="contained"
                startIcon={<GoogleLogoIcon />}
                onClick={handleGoogleSignup}
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  color: '#3c4043',
                  fontWeight: '500',
                  fontSize: '14px',
                  textTransform: 'none',
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                  '&:hover': {
                    boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
                    backgroundColor: '#f8f9fa',
                  },
                  '&:active': {
                    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                    backgroundColor: '#f1f3f4',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Sign up with Google
              </Button>
              
              <Box textAlign="center">
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: "#6366f1", 
                      textDecoration: "none",
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "underline"
                      }
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Signup;
