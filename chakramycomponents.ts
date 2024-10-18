// chakra-components.ts
import dynamic from 'next/dynamic';

export const Avatar = dynamic(() => import('@chakra-ui/react').then((module) => module.Avatar));
export const Button = dynamic(() => import('@chakra-ui/react').then((module) => module.Button));
export const Flex = dynamic(() => import('@chakra-ui/react').then((module) => module.Flex));
export const Heading = dynamic(() => import('@chakra-ui/react').then((module) => module.Heading));
export const Menu = dynamic(() => import('@chakra-ui/react').then((module) => module.Menu));
export const Text = dynamic(() => import('@chakra-ui/react').then((module) => module.Text));
export const useDisclosure = dynamic(() => import('@chakra-ui/react').then((module) => module.useDisclosure));
export const MenuButton = dynamic(() => import('@chakra-ui/react').then((module) => module.MenuButton));
export const MenuList = dynamic(() => import('@chakra-ui/react').then((module) => module.MenuList));
export const Input = dynamic(() => import('@chakra-ui/react').then((module) => module.Input));
export const Stack = dynamic(() => import('@chakra-ui/react').then((module) => module.Stack));
export const InputGroup = dynamic(() => import('@chakra-ui/react').then((module) => module.InputGroup));
export const InputLeftElement = dynamic(() => import('@chakra-ui/react').then((module) => module.InputLeftElement));
export const InputRightElement = dynamic(() => import('@chakra-ui/react').then((module) => module.InputRightElement));
export const Box = dynamic(() => import('@chakra-ui/react').then((module) => module.Box));
export const Grid = dynamic(() => import('@chakra-ui/react').then((module) => module.Grid));
export const VStack = dynamic(() => import('@chakra-ui/react').then((module) => module.VStack));
export const FormControl = dynamic(() => import('@chakra-ui/react').then((module) => module.FormControl));
export const FormLabel = dynamic(() => import('@chakra-ui/react').then((module) => module.FormLabel));
export const FormErrorMessage = dynamic(() => import('@chakra-ui/react').then((module) => module.FormErrorMessage));
export const FormHelperText = dynamic(() => import('@chakra-ui/react').then((module) => module.FormHelperText));
export const chakra = dynamic(() => import('@chakra-ui/react').then((module) => module.chakra));