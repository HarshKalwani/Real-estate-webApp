import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {Swiper , SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';
import SwiperCore from 'swiper'; 
import ListingItem from '../components/ListingItem'

const Home = () => {
  const [offerListing , setOfferListing] = useState([]);
  const [sellListing , setSellListing] = useState([]);
  const [rentListing , setRentListing] = useState([]);
  console.log(sellListing)
  SwiperCore.use([Navigation])


  useEffect(() => {
    const fetchOfferListing =async() =>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListing = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListing(data);
        fetchSellListing();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSellListing =async() =>{
      try {
        const res = await fetch('/api/listing/get?type=sell&limit=4');
        const data = await res.json();
        setSellListing(data);
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListing();
  }, [])
  
  return (
    <div>
      {/* top */}
      <div className='flex flex-col p-28 px-3 gap-6 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl '>Find your next <span className=' text-slate-500'>perfect</span> <br/>place with ease</h1> 
        <div className=" text-gray-400 sm:text-sm text-xs">
          Super Balle Estate is the best place to find your next perfect ple to live.
          <br />
          We have a wide range of properties for you to choose from 
        </div>

        <Link to={'/search'} className=' text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Lets get started...
        </Link>
      </div>

      {/* swiper */}

      <Swiper navigation>
      {
        offerListing && offerListing.length > 0 && offerListing.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:"cover"}} className='h-[500px] ' key={listing._id}></div>
          </SwiperSlide>
        ))
      }
      </Swiper>

      {/* listing results for offer sale and rent  */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListing && offerListing.length > 0 && (
            <div>
              <div className=" my-3">
                <h2 className='text-2xl font-semibold text-slate-600 '>Recent Offers</h2>
                <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>
                  Show more offers 
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListing.map((listing) => (
                  <ListingItem listing = {listing} key={listing._id}/>
                ))
                }
              </div>
            </div>
          )
        }


        {
          rentListing && rentListing.length > 0 && (
            <div>
              <div className=" my-3">
                <h2 className='text-2xl font-semibold text-slate-600 '>Recent place for rent</h2>
                <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
                  Show more place for rent 
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListing.map((listing) => (
                  <ListingItem listing = {listing} key={listing._id}/>
                ))
                }
              </div>
            </div>
          )
        }


        {
          sellListing && sellListing.length > 0 && (
            <div>
              <div className=" my-3">
                <h2 className='text-2xl font-semibold text-slate-600 '>Recent placed for sell</h2>
                <Link to={'/search?type=sell'} className='text-sm text-blue-800 hover:underline'>
                  Show more places for sell
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  sellListing.map((listing) => (
                  <ListingItem listing = {listing} key={listing._id}/>
                ))
                }
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}

export default Home