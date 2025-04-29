import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiLock, FiMail, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Styled Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ModalContainer = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.4s ease-out;
  border: 1px solid ${props => props.theme.border};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, ${props => props.theme.accent}, ${props => props.theme.primary});
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 36px;
  height: 36px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  color: ${props => props.active ? props.theme.accent : props.theme.text};
  font-size: 1.1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.active ? props.theme.accent : 'transparent'};
    transition: all 0.3s ease;
  }

  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.accent}30;
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text}80;
  font-size: 1.2rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
  }
`;

const GoogleButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.cardBackground};
    border-color: ${props => props.theme.accent};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: ${props => props.theme.text}80;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${props => props.theme.border};
  }

  span {
    padding: 0 1rem;
    font-size: 0.9rem;
  }
`;

const ForgotPassword = styled.a`
  color: ${props => props.theme.accent};
  text-align: right;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: -0.5rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${props => props.theme.error}10;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled(motion.div)`
  color: ${props => props.theme.success};
  background: ${props => props.theme.success}10;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Reset form when tab changes
  useEffect(() => {
    setError("");
    setSuccess(false);
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (activeTab === "signin") {
        await signIn(email, password);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        await signUp(name, email, password);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred during Google authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>

            <TabContainer>
              <Tab
                active={activeTab === "signin"}
                onClick={() => setActiveTab("signin")}
              >
                Sign In
              </Tab>
              <Tab
                active={activeTab === "signup"}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </Tab>
            </TabContainer>

            <Form onSubmit={handleSubmit}>
              {activeTab === "signup" && (
                <InputGroup>
                  <InputIcon>
                    <FiUser />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </InputGroup>
              )}

              <InputGroup>
                <InputIcon>
                  <FiMail />
                </InputIcon>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>

              {activeTab === "signin" && (
                <ForgotPassword href="#">Forgot password?</ForgotPassword>
              )}

              {error && (
                <ErrorMessage>
                  <FiAlertCircle />
                  {error}
                </ErrorMessage>
              )}

              {success && (
                <SuccessMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {activeTab === "signin" 
                    ? "Successfully signed in! Redirecting..." 
                    : "Account created successfully! Redirecting..."}
                </SuccessMessage>
              )}

              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || success}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {activeTab === "signin" ? "Sign In" : "Create Account"}
                    <FiArrowRight />
                  </>
                )}
              </SubmitButton>
            </Form>

            <Divider>
              <span>OR</span>
            </Divider>

            <GoogleButton
              onClick={handleGoogleAuth}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || success}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <FcGoogle size={24} />
                  Continue with Google
                </>
              )}
            </GoogleButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;