import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";

const Home = () => {
  const properties = [
    {
      id: 1,
      title: "Organic Wheat Farm",
      location: "Punjab, India",
      price: "₹45,00,000",
      image:
        "https://media.istockphoto.com/id/2204921076/photo/the-green-field-of-wheat-grains-which-are-full-of-seed-heads-with-nature-background.jpg?s=612x612&w=0&k=20&c=vJxpu-aS8dUgyJYS4UrrlbyIzyZiBS_sqGQu7cZFgaw=", // wheat field
    },
    {
      id: 2,
      title: "Luxury Mango Orchard",
      location: "Maharashtra, India",
      price: "₹60,00,000",
      image:
        "https://media.istockphoto.com/id/1496539535/photo/raw-green-unripe-mangoes-in-blur-green-background.jpg?s=612x612&w=0&k=20&c=927ncap9e2iu-bbRRdieMA0A2C7I4HiGzrYyg7yIrdQ=", // mango orchard
    },
    {
      id: 3,
      title: "Farmhouse with Rice Fields",
      location: "Kerala, India",
      price: "₹85,00,000",
      image:
        "https://media.istockphoto.com/id/1217110528/photo/rice-field.jpg?s=612x612&w=0&k=20&c=BgEdZO8ng6wj76ayGLuSVEZJrM40zk4AELMeGK-IJrY=", // rice fields farmhouse
    },
    {
      id: 4,
      title: "Premium Vineyard Estate",
      location: "Nashik, India",
      price: "₹1,20,00,000",
      image:
        "https://media.istockphoto.com/id/2175872960/photo/a-frame-mansion.jpg?s=612x612&w=0&k=20&c=iFLWS0xQ2d3r3WFzQPDTiml4wYi1YoWShjrqXSfgcIs=", // vineyard estate
    },
    {
      id: 5,
      title: "Eco-friendly Farm Villa",
      location: "Goa, India",
      price: "₹95,00,000",
      image:
        "https://media.istockphoto.com/id/1916980202/photo/solar-photovoltaic-panels-on-a-wood-house-roof.jpg?s=612x612&w=0&k=20&c=4sUu3TB7FJfHqb9mC6bm7uk974BXWesL8MK69vBuI0g=", // eco villa
    },
    {
      id: 6,
      title: "Sugarcane Estate with Irrigation",
      location: "Uttar Pradesh, India",
      price: "₹70,00,000",
      image:
        "https://media.istockphoto.com/id/104555777/photo/panoramic-view-of-sugarcane-field.jpg?s=612x612&w=0&k=20&c=g9OVcrdAMV6--qfWtoP7zz-4hKoRUY-hyRJd-vr9DVY=", // sugarcane fields
    },
    {
      id: 7,
      title: "Tea Plantation Retreat",
      location: "Darjeeling, India",
      price: "₹1,10,00,000",
      image:
        "https://media.istockphoto.com/id/501432908/photo/green-tea-plantations-in-munnar-kerala-india.jpg?s=612x612&w=0&k=20&c=zzM7eOoOnmWuEFvrSbd9y2tpfS5Wh3DtzBwfyaTH_Xc=", // tea estate
    },
    {
      id: 8,
      title: "Coconut Grove Farmhouse",
      location: "Tamil Nadu, India",
      price: "₹80,00,000",
      image:
        "https://images.unsplash.com/photo-1742614098754-8505e7c66c43?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE1fHxDb2NvbnV0JTIwR3JvdmUlMjBGYXJtaG91c2V8ZW58MHx8MHx8fDA%3D", // coconut farm
    },
    {
      id: 9,
      title: "Paddy Fields with Water Canal",
      location: "Andhra Pradesh, India",
      price: "₹55,00,000",
      image:
        "https://images.unsplash.com/photo-1711447726403-21267951f674?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFBhZGR5JTIwRmllbGRzJTIwd2l0aCUyMFdhdGVyJTIwQ2FuYWx8ZW58MHx8MHx8fDA%3D", // paddy fields
    },
    {
      id: 10,
      title: "Floriculture Farm with Greenhouse",
      location: "Karnataka, India",
      price: "₹90,00,000",
      image:
        "https://media.istockphoto.com/id/179766986/photo/a-zoomed-out-view-of-geranium-plants-inside-a-greenhouse.webp?a=1&b=1&s=612x612&w=0&k=20&c=KYHPe_vvcw-rDBSGVoqsFEKD7Qo7wc95AtnuF3pLhRM=", // flower farm
    },
  ];



  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Discover Premium Agricultural Estates</h1>
          <p className="hero-subtitle">
            Find farmhouses, organic farmlands, and luxury rural properties
            tailored for you.
          </p>
          <form className="search-form">
            <input
              type="text"
              placeholder="Search by location, crop type, etc..."
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-section">
        <h2 className="featured-title">Featured Agricultural Properties</h2>
        <div className="slider" >
          <Slider {...settings}>
            {properties.map((property) => (
              <div key={property.id} className="property-slide">
                <div className="property-card">
                  <img src={property.image} alt={property.title} className="property-img" />
                  <div className="property-overlay">
                    <h3>{property.title}</h3>
                    <p>{property.location}</p>
                    <span>{property.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section >
    </div >
  );
};

export default Home;
