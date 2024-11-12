import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info';
import NewDM from './components/new-dm';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactsList from '@/components/ContactsList';

const ConatactContainer = () => {

  const { directMessagesContacts, setDirectMessagesContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    getContacts();
  }, [directMessagesContacts]);

  return (
    <div className='relative h-[90vh] sm:h-[100vh] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-black border-r-2 border-gray-300 w-full'>
      <div className="my-5">
        <div className="flex items-center justify-between px-4">
          <h6 className="flex justify-center items-center  uppercase tracking-widest text-neutral300 font-bold text-opacity-90 text-md">
            <img src="/icon.webp" alt="logo" height={50} width={50}/>
            <span>FlowChat</span>
          </h6>
          <NewDM />
        </div>
        <div >
          <ContactsList contacts={directMessagesContacts} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ConatactContainer
