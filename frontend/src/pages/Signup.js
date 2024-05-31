import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Image,
  HStack,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AtSignIcon, EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SignUpImg from '../assets/signup.jpg';
import { ChatState } from '../context/ChatProvider';

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser } = ChatState();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    // eslint-disable-next-line
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    cPassword: '',
  });
  const { name, email, password, cPassword } = credentials;

  const [pic, setPic] = useState();

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    if (!name || !email || !password || !cPassword) {
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
    if (password !== cPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/api/v1/auth/createuser`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, pic }), // body data type must match "Content-Type" header
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data));
        setLoading(false);
        setUser(JSON.stringify(data));
        navigate('/chats');
        toast({
          title: 'User Successfully Registered:',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      } else {
        toast({
          title: 'Error:',
          description: data.errors[0].msg,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      toast({
        title: 'Error occured',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
  };

  const postPic = async (userPic) => {
    setLoading(true);
    if (userPic === undefined) {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
    if (userPic.type === 'image/jpeg' || userPic.type === 'image/png') {
      const data = new FormData();
      data.append('file', userPic);
      data.append('upload_preset', 'ChatApp');
      data.append('cloud_name', 'gurjotgill');

      try {
        const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
          method: 'POST',
          body: data,
        });
        const picData = await response.json();
        setPic(picData.secure_url);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('twitter.500')}
      >
        <Box
          rounded={'lg'}
          width={['88%', '70%', '80%']}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'dark-lg'}
          p={2}
          height={'auto'}
        >
          <HStack>
            <Stack spacing={4} mx={'auto'} maxW={'lg'} py={5} px={6}>
              <Stack align={'center'}>
                <Heading fontSize={'4xl'} textAlign={'center'}>
                  Sign up
                </Heading>
                <Text fontSize={'lg'} color={'gray.600'}>
                  to enjoy all of our cool features ✌️
                </Text>
              </Stack>

              <Stack spacing={2}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<AtSignIcon color='gray.300' />}
                    />
                    <Input
                      placeholder='Enter full name'
                      name='name'
                      id='name'
                      value={name}
                      onChange={onChange}
                      type='text'
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email address</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<EmailIcon color='gray.300' />}
                    />
                    <Input
                      placeholder='Enter email address'
                      name='email'
                      id='email'
                      value={email}
                      onChange={onChange}
                      type='email'
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      placeholder='Enter password'
                      name='password'
                      id='password'
                      value={password}
                      onChange={onChange}
                      type={showPassword ? 'text' : 'password'}
                    />
                    <InputLeftElement
                      pointerEvents='none'
                      children={<LockIcon color='gray.300' />}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      placeholder='Confirm password'
                      name='cPassword'
                      id='cPassword'
                      value={cPassword}
                      onChange={onChange}
                      type={showPassword ? 'text' : 'password'}
                    />
                    <InputLeftElement
                      pointerEvents='none'
                      children={<LockIcon color='gray.300' />}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Upload Your Profile Pic</FormLabel>
                  <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postPic(e.target.files[0])}
                  />
                </FormControl>
                <Stack spacing={3}>
                  <Button my={3} colorScheme='twitter' onClick={handleSignup} isLoading={loading}>
                    Sign Up
                  </Button>
                  <Stack>
                    <Text align={'center'}>
                      Already have an account?{' '}
                      <RouterLink to={'/login'}>
                        <Button variant='link' color={'blue.400'}>
                          Login
                        </Button>
                      </RouterLink>
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack width={{ base: '0', lg: '50%', md: '50%', sm: '0' }}>
              <Image
                boxSize={{ base: '0', lg: '550px', md: '500px', sm: '0' }}
                objectFit='fill'
                src={SignUpImg}
              ></Image>
            </Stack>
          </HStack>
        </Box>
      </Flex>
    </>
  );
};

export default Signup;
