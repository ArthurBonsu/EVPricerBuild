function isException(error) {
    let strError = error.toString();

   
    return strError.includes('invalid opcode') || strError.includes('invalid JUMP') || strError.includes('revert');
}

// Here is how we console log the errror 
function ensureException(error) {

    assert(isException(error), error.toString());
}

module.exports = {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    ensureException: ensureException
};
module.exports={
    zeroAddress: '0x0000000000000000000000000000000000000000',
    ensureException: ensureException 
}