import { Button, ButtonProps, Flex, useDisclosure } from '@chakra-ui/react'
import AppModal from '@components/AppModal'
import { useSafeSdk } from 'hooks'
import { loadComponents } from 'next/dist/server/load-components'
import { useEffect, useState } from 'react'


// For finally making execution on the blockchain 



interface ExecuteTransferProps  {
  colorScheme?: string
  variant?: string 
  isDisabled?:  boolean
  safeTxHash: string
  safeRejectTxHash: string | null
  threshold: string | number | undefined
  nonce: number
  hashTxn?: string 
}

// This is for the execution
const DAO: React.FC<ExecuteTransferProps> = ({
  safeTxHash,
  safeRejectTxHash,
  threshold,
  
  nonce,
  hashTxn,
  ...rest
}) => {
  const [approveExeIsLoading, setApproveExeIsLoading] = useState(false)
  const [rejectExeIsLoading, setRejectExeIsLoading] = useState(false)

  const [isApprovalExecutable, setIsApprovalExecutable] = useState(false)
  const [isRejectionExecutable, setIsRejectionExecutable] = useState(false)
  const localDisclosure = useDisclosure()
 
  const { isTxnExecutable, safeService, approveTransfer, rejectTransfer } = useSafeSdk()
  // the attribute should be here 
  useEffect(() => {
    const getExecutables = async () => {
      if (safeTxHash && threshold) {

   
        const approvalTx = await safeService.getTransaction(safeTxHash)
        if (approvalTx && isTxnExecutable(Number(threshold), approvalTx)) {
          setIsApprovalExecutable(true)
        }
      }

      if (safeRejectTxHash) {
        const rejectionTx = await safeService.getTransaction(safeRejectTxHash)
        if (rejectionTx && isTxnExecutable(Number(threshold), rejectionTx)) {
          setIsRejectionExecutable(true)
        }
      }
    }

    getExecutables()
  }, [isTxnExecutable, safeRejectTxHash, safeService, safeTxHash, threshold])

  return (
    <div>

      <Button {...rest} onClick={localDisclosure.onOpen}>
        Execute
      </Button>

      <AppModal disclosure={localDisclosure} title="Execute Transaction" modalSize="sm">
        <Flex justify="space-between" py={6} alignItems="center" flexDirection="row">
          {isApprovalExecutable && (
           <Button
           isLoading={approveExeIsLoading}
           isDisabled={approveExeIsLoading}
           onClick={async () => {
             setApproveExeIsLoading(true)
             await approveTransfer({ safeTxHash, execTxn: true, hashTxn: hashTxn || '' })
             setApproveExeIsLoading(false)
             localDisclosure.onClose()
           }}
         >
           Execute Approval
         </Button>
          )}
          {isRejectionExecutable && (
           <Button
           isLoading={rejectExeIsLoading}
           isDisabled={rejectExeIsLoading}
           onClick={async () => {
             setRejectExeIsLoading(true)
             await rejectTransfer({ safeTxHash: safeRejectTxHash, execTxn: true, hashTxn: hashTxn || '', nonce })
             setRejectExeIsLoading(false)
             localDisclosure.onClose()
           }}
         >
           Execute Rejection
         </Button>
          )}
        </Flex>
      </AppModal>
    </div>
  )
}

export default DAO
