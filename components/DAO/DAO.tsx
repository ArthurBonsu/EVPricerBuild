// File 9: DAO.tsx
import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import useDaoContext from 'context/useDaoContext';
import { useLoadSafe } from 'hooks/useLoadSafe';

import { useSafeDetailsAndSetup } from 'hooks/useSafeDetails.ts';


interface PaymentTransactions {
  safeTxHash: string;
  safeRejectTxHash: string | null;
  threshold: string | number | undefined;
  nonce: number;
  hashTxn?: string;
}

interface ExecuteTransferProps {
  transaction: PaymentTransactions;
  safeAddress: string;
  userAddress: string;
}



const DAO: React.FC<ExecuteTransferProps> = ({ transaction, safeAddress, userAddress, ...rest }) => {
  const { createProposal, voteOnProposal, executeProposal, approveProposal, rejectProposal, sendPayment } = useDaoContext();
  const { safeDetails } = useSafeDetailsAndSetup();
  const { transactions, sendTransaction } = useTransactions();

  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [vote, setVote] = useState('');
  const [executionTxHash, setExecutionTxHash] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRecipient, setPaymentRecipient] = useState('');

  useEffect(() => {
    console.log('Safe details:', safeDetails);
  }, [safeDetails]);

  const handleCreateProposal = async () => {
    await createProposal(proposalTitle, proposalDescription);
  };

  const handleVoteOnProposal = async () => {
    await voteOnProposal(vote);
  };

  const handleExecuteProposal = async () => {
    const txHash = await executeProposal();
    setExecutionTxHash(txHash);
  };

  const handleApproveProposal = async () => {
    setIsApproving(true);
    await approveProposal();
    setIsApproving(false);
  };

  const handleRejectProposal = async () => {
    setIsRejecting(true);
    await rejectProposal();
    setIsRejecting(false);
  };

  const handleSendPayment = async () => {
    await sendPayment( payment.username, , payment.amount,payment.contractaddress,receipient,txhash,owneraddress,USDprice)
  const handleSendTransaction = async () => {
    await sendTransaction();
  };

  return (
    <div>
      <h1>DAO Service</h1>
  
      {/* Create Proposal Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="Proposal title"
            />
            <Input
              type="text"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              placeholder="Proposal description"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateProposal}>
              Create Proposal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Vote on Proposal Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vote on Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              value={vote}
              onChange={(e) => setVote(e.target.value)}
              placeholder="Vote (yes/no)"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleVoteOnProposal}>
              Vote
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Execute Proposal Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Execute Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Execution transaction hash: {executionTxHash}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleExecuteProposal}>
              Execute
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Approve Proposal Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Approving proposal...</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleApproveProposal} isLoading={isApproving}>
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Reject Proposal Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Rejecting proposal...</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleRejectProposal} isLoading={isRejecting}>
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Send Payment Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Payment amount"
            />
            <Input
              type="text"
              value={paymentRecipient}
              onChange={(e) => setPaymentRecipient(e.target.value)}
              placeholder="Payment recipient"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSendPayment}>
              Send Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Send Transaction Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Sending transaction...</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSendTransaction}>
              Send Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
      {/* Transaction History Modal */}
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Transaction history:</p>
            {transactions.map((transaction: { hash: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }, index: React.Key | null | undefined) => (
              <p key={index}>{transaction.hash}</p>
            ))}
             </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue">Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</div>

);
};

export default DAO;