// contracts/Safe.sol
pragma solidity ^0.8.0;

contract Safe {
    // Owners and their weights
    mapping(address => uint256) public owners;
    uint256 public threshold;

    // Assets held by the Safe
    mapping(address => uint256) public assets;

    // Transaction queue
    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        uint256 approvals;
        bool executed;
    }
    Transaction[] public transactions;

    // Approvals for each transaction
    mapping(uint256 => mapping(address => bool)) public confirmations;

    // Events
    event OwnerAdded(address indexed owner, uint256 weight);
    event OwnerRemoved(address indexed owner);
    event ThresholdUpdated(uint256 threshold);
    event Deposited(address indexed asset, uint256 amount);
    event Transferred(address indexed recipient, uint256 amount);
    event TransactionApproved(uint256 indexed txId, address indexed owner);
    event TransactionExecuted(uint256 indexed txId);
    event ExecutionFailure(uint256 indexed txId);
    event ConfirmTransaction(uint256 indexed txId);
    // Modifier to check if the caller is an owner
    modifier onlyOwner() {
        require(owners[msg.sender] > 0, "Only owners can call this function");
        _;
    }

    modifier confirmed(uint256 transactionId, address owner) {
        require(confirmations[transactionId][owner], "Transaction not confirmed");
        _;
    }

    modifier notConfirmed(uint256 transactionId, address owner) {
        require(!confirmations[transactionId][owner], "Transaction already confirmed");
        _;
    }

    modifier notExecuted(uint256 transactionId) {
        require(!transactions[transactionId].executed, "Transaction already executed");
        _;
    }

    // Constructor to initialize the Safe
    constructor(address[] memory _owners, uint256[] memory _weights, uint256 _threshold) {
        require(_owners.length == _weights.length, "Owners and weights length mismatch");
        require(_owners.length > 0, "Owners required");
        require(_threshold > 0 && _threshold <= _owners.length, "Invalid threshold");

        for (uint256 i = 0; i < _owners.length; i++) {
            owners[_owners[i]] = _weights[i];
        }
        threshold = _threshold;
    }

    // Add a new owner with a specified weight
    function addOwner(address owner, uint256 weight) public onlyOwner {
        require(owners[owner] == 0, "Owner already exists");
        owners[owner] = weight;
        emit OwnerAdded(owner, weight);
    }

    // Remove an owner
    function removeOwner(address owner) public onlyOwner {
        require(owners[owner] > 0, "Owner does not exist");
        delete owners[owner];
        emit OwnerRemoved(owner);
    }

    // Update the threshold value
    function setThreshold(uint256 newThreshold) public onlyOwner {
        require(newThreshold > 0, "Threshold must be greater than 0");
        threshold = newThreshold;
        emit ThresholdUpdated(threshold);
    }

    // Deposit assets into the Safe
    receive() external payable {
        assets[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // Transfer assets out of the Safe (requires owner approvals)
    function transfer(address destination, uint256 value, bytes memory data) public onlyOwner {
        require(destination != address(0), "Invalid recipient");
        require(value > 0, "Invalid value");

        uint256 transactionId = transactions.length;

        transactions.push(Transaction({
            destination: destination,
            value: value,
            data: data,
            approvals: 0,
            executed: false
        }));
        emit Transferred(destination, value);
        emit ConfirmTransaction(transactionId);
    }

    // Approve a transaction
    function approveTransaction(uint256 transactionId) public onlyOwner {
        require(transactionId < transactions.length, "Transaction does not exist");
        require(!confirmations[transactionId][msg.sender], "Transaction already confirmed");

        confirmations[transactionId][msg.sender] = true;
        transactions[transactionId].approvals += owners[msg.sender];

        emit TransactionApproved(transactionId, msg.sender);
        executeTransaction(transactionId);
    }

    // Execute a transaction if it has reached the required threshold of approvals
    function executeTransaction(uint256 transactionId) public onlyOwner notExecuted(transactionId) {
        require(transactionId < transactions.length, "Transaction does not exist");
        require(transactions[transactionId].approvals >= threshold, "Threshold not reached");

        Transaction storage txn = transactions[transactionId];
        txn.executed = true;

        (bool success, ) = txn.destination.call{value: txn.value}(txn.data);
        if (success) {
            emit TransactionExecuted(transactionId);
        } else {
            emit ExecutionFailure(transactionId);
            txn.executed = false;
        }
    }

    // Helper function to check if an address is an owner
    function isOwner(address account) public view returns (bool) {
        return owners[account] > 0;
    }
}
