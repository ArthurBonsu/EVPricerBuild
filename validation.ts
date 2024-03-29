import { CreateTransferInput } from 'types'
import { InferType, number, object, SchemaOf, string, array } from 'yup'
import { TokenTypesDetails, CreateSwapTransferInput } from 'types'
import {CSVProps} from 'types/index'

// This sets the schema for validation we use yep for this 
export const createTransferFormSchema: SchemaOf<{ recipients: Array<Omit<CreateTransferInput, 'accessType'>> }> =
  object().shape({
    recipients: array().of(
      object().shape({
        asset: string().required('Asset is required.'),
        amount: number()
          .positive('Must be a positive number')
          .typeError('Must be a number.')
          .required('Amount is required.'),
        recipient: string().required('Recipient is required.'),
      })
    ),
  })

export type TCreateTransferFormSchemaValues = InferType<typeof createTransferFormSchema>


// This sets the schema for validation we use yep for this 
export const createSwapFormSchema: SchemaOf<{ tokendetails:TokenTypesDetails}> =
  object().shape({
    
        symbol: string().required('Number is required.'),
        tokenstring: string().required('Number is required here'),
        decimals: number().required('Decimals is required.'),
        logoUri: string().required('Logo is required.'),
          address: string().required('Recipient is required.'),
      // Required must be added
    
  }).required()



export type TCreateSwapTransferInput = InferType<typeof createSwapFormSchema>


// This sets the schema for validation we use yep for this 
export const createSwapTransferFormSchema: SchemaOf<{ swaptokendetails:CreateSwapTransferInput}> =
  object().shape({
    tokenAname:string().required('Token name is required.'),
    symbolA:string().required('Symbol is required.'),
    tokenBname: string().required('Token name  is required.'),
    symbolB:string().required('Symbol  is required.'),
    amount:number().required('Amount is required.'),
       
    
  }).required()


  
export type TcreateSwapTransferFormSchema = InferType<typeof createSwapTransferFormSchema>

export const createCSCFormSchema: SchemaOf<{ csvinputdetails:CSVProps}> =
  object().shape({
  rows: array<object>().required('Rows must be supplied.'),
  date : string().required('Date is required.'), 
  pvvalue: string().required('Portfolio value is required.'),
  timestamp:string().required('Timestamp is required.'),
  transaction_type:string().required('Transaction is required.'),
  token: string().required('Token is required.'),
  amount: string().required('Amount is required.'),
       

  }).required()


  
export type TcreateCSCFormSchemaValues = InferType<typeof createCSCFormSchema>
