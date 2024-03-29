import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface AppModalProps extends PropsWithChildren {
  disclosure: UseDisclosureReturn
  title?: string
  closeOnOverlayClick?: boolean
  modalSize?: ModalProps['size']
  bodymessage? : string 
}

/// THE APP MODAL
const AppModal: React.FC<PropsWithChildren<AppModalProps>> = ({ disclosure, title, modalSize = '4xl',  bodymessage, closeOnOverlayClick, children,   ...rest }) => (
  <Modal onClose={disclosure.onClose} isOpen={disclosure.isOpen} size={modalSize} closeOnOverlayClick={true} {...rest}>
    <ModalOverlay />
    <ModalContent>
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
    </ModalContent>
  </Modal>
)

export default AppModal
