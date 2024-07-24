// contracts/MultiSigWallet.sol
pragma solidity ^0.8.0;

contract MultiSigWallet {
    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
    }

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public threshold;
    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public approvals;

    event Deposit(address indexed sender, uint256 amount);
    event TransactionSubmitted(uint256 indexed txId);
    event TransactionApproved(uint256 indexed txId, address indexed owner);
    event TransactionExecuted(uint256 indexed txId);
    event TransactionFailed(uint256 indexed txId);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event ThresholdUpdated(uint256 newThreshold);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier txExists(uint256 txId) {
        require(txId < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notApproved(uint256 txId) {
        require(!approvals[txId][msg.sender], "Transaction already approved");
        _;
    }

    modifier notExecuted(uint256 txId) {
        require(!transactions[txId].executed, "Transaction already executed");
        _;
    }

    constructor(address[] memory _owners, uint256 _threshold) {
        require(_owners.length > 0, "Owners required");
        require(_threshold > 0 && _threshold <= _owners.length, "Invalid threshold");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        threshold = _threshold;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function submitTransaction(address destination, uint256 value, bytes memory data) public onlyOwner {
        uint256 txId = transactions.length;

        transactions.push(Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        }));

        emit TransactionSubmitted(txId);
        approveTransaction(txId);
    }

    function approveTransaction(uint256 txId) public onlyOwner txExists(txId) notApproved(txId) {
        approvals[txId][msg.sender] = true;
        emit TransactionApproved(txId, msg.sender);
        executeTransaction(txId);
    }

    function executeTransaction(uint256 txId) public onlyOwner txExists(txId) notExecuted(txId) {
        Transaction storage txn = transactions[txId];
        if (isApproved(txId)) {
            txn.executed = true;
            (bool success, ) = txn.destination.call{value: txn.value}(txn.data);
            if (success) {
                emit TransactionExecuted(txId);
            } else {
                emit TransactionFailed(txId);
                txn.executed = false;
            }
        }
    }

    function isApproved(uint256 txId) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (approvals[txId][owners[i]]) {
                count += 1;
            }
            if (count >= threshold) {
                return true;
            }
        }
        return false;
    }

    function addOwner(address owner) public onlyOwner {
        require(owner != address(0), "Invalid owner");
        require(!isOwner[owner], "Owner not unique");

        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAdded(owner);
    }

    function removeOwner(address owner) public onlyOwner {
        require(isOwner[owner], "Not an owner");

        isOwner[owner] = false;
        for (uint256 i = 0; i < owners.length - 1; i++) {
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        }
        owners.pop();
        emit OwnerRemoved(owner);

        if (threshold > owners.length) {
            updateThreshold(owners.length);
        }
    }

    function updateThreshold(uint256 newThreshold) public onlyOwner {
        require(newThreshold > 0 && newThreshold <= owners.length, "Invalid threshold");
        threshold = newThreshold;
        emit ThresholdUpdated(newThreshold);
    }
}
