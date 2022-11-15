import React from 'react'
import '../css/dashboard/header.css'
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
// import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import IconButton from '@mui/material/IconButton';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {Avatar} from '@mui/material'
import { Link, useHistory } from 'react-router-dom';
import LocalStorageservice from '../../services/localStorageservice';
import { notification } from 'antd';
import LogoutIcon from '@mui/icons-material/Logout';

function Header(props) {

    let history = useHistory()


    const home = () => {
        try{
            return history.push('/dashboard')
        } catch(err) {
            console.error(err)
        }
    }

    const logout = async () => {
        
        try {
            LocalStorageservice.removeToken()
            props.setRole('guest')
            notification.success({
                message: "Logout"
            })

            return history.push('/login')

        } catch (error) {
            console.error(error)
        }

    }

  return (
        <div className='header'>
            <div className='header_left' >

                        <IconButton onClick={home}>
                            <FacebookRoundedIcon style={{color : 'blue'}} fontSize ='large'/>
                        </IconButton>
                
                <div className='header_input'>
                    <SearchIcon />
                    
                    <input 
                        type='text' 
                        placeholder='Search Facebook'
                        />
                </div>


            </div>


            <div className='header_center'>
                <div className='header_option header_option--active'>
                    <HomeIcon fontSize='large' />
                </div>
                <div className='header_option'>
                    <OndemandVideoIcon fontSize='large'/>
                </div>
                <div className='header_option'>
                    <StorefrontIcon fontSize='large'/>
                </div>
                <div className='header_option'>
                    <GroupsRoundedIcon fontSize='large'/>
                </div>
                <div className='header_option'>
                    <SportsEsportsIcon fontSize='large'/>
                </div>
            </div>
            <div className='header_right' >
                <Link to={{
                    pathname : '/user',
                    state : {
                        user_id : props.user.id
                    }
                }}>
                        <div className='header_info' >
                            <Avatar src={props.user.image} />
                            <span>{props.user.firstname} {props.user.lastname}</span>
                        </div>
                </Link>

                <IconButton>
                    <MenuRoundedIcon fontSize='large'/>
                </IconButton>
                <IconButton>
                    <ForumRoundedIcon fontSize='large'/>
                </IconButton>
                <IconButton>
                    <NotificationsRoundedIcon fontSize='large'/>
                </IconButton>
                <IconButton>
                    <ArrowDropDownCircleIcon fontSize='large'/>
                </IconButton>
                <IconButton>
                    <LogoutIcon fontSize='large' style={{color : 'red'}} onClick ={()=>logout()}/>
                </IconButton>
            </div>
        </div>
    )
}

export default Header