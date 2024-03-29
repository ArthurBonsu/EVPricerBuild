import {   Heading , Stack, Image} from "@chakra-ui/react";
import { BiCopyright } from "react-icons/bi";
import logo from "../../images/blockdaologo.png";
import {BsGithub, BsTwitter, BsGoogle} from 'react-icons/bs'
import {Icon, PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
interface FooterProps{
message:string 
community:string
copyright:string 
blog: string
FAQ: string
Contact:string
Githuburl: string   
Twitterurl: string   
Discordurl: string 
}

const Footer: React.FC<FooterProps> = ({
   
community,blog,FAQ,Contact,Githuburl, Twitterurl, Discordurl, copyright, message
  }) => {

// Implementations of icon clicks done here
    return (
     <>
     <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <Icon     as ={BsGithub} href={Githuburl} />
        <Icon     as ={BsTwitter}  href={Discordurl}/>
        <Icon     as ={BsGoogle}  href={Twitterurl}/>
      </div>
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
        <p className="text-white text-base text-center mx-2 cursor-pointer">{community}</p>
        <p className="text-white text-base text-center mx-2 cursor-pointer">{blog}</p>
        <p className="text-white text-base text-center mx-2 cursor-pointer">{FAQ}</p>
       
        

      </div>
    </div>

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">{message}</p>
      <p className="text-white text-sm text-center font-medium mt-2">{Contact}</p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">{Contact}</p>
      <p className="text-white text-right text-xs">{copyright}</p>
    </div>
  </div>
     </>
    )
}

export default Footer;