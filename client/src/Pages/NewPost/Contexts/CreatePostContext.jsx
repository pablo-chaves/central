import { createContext, useState, useEffect } from 'react';
import FirstStep from '../FirstStep/FirstStep';
import SecondStep from '../SecondStep/SecondStep';
import ThirdStep from '../ThirdStep/ThirdStep';
import FourthStep from '../FourthStep/FourthStep';
import FifthStep from '../FifthStep/FifthStep';
import SixthStep from '../SixthStep/SixthStep';
import MercadoPago from '../../../Components/MercadoPago/MercadoPago';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { valueTypes } from '../../../Services/properties.service';
import axios from 'axios';

export const CreatePostContext = createContext({});

const CreatePostProvider = ({ children, match, ...routerProps }) => {
  const [current, setCurrent] = useState(0);
  const [infoPlan, setInfoPlan] = useState({});
  const { REACT_APP_API_BASE_ENDPOINT } = process.env;
  const { session } = useSelector((store) => store);
  const search = useLocation().search;
  // const orderId = new URLSearchParams(search).get('orderId');
  // const plan = new URLSearchParams(search).get('plan');
  // ======================================================================
  function query(url) {
    const obj = {};
    const array = url.replace('?', '').split('&');
    for (let i = 0; i < array.length; i++) {
      let arr = array[i].split('=');
      obj[arr[0]] = arr[1];
    }
    return obj;
  }

  const {
    planId, // id del plan
    planTitle, // basic o premium
  } = match.params;

  const {
    status, // se usa para crear la order (approved)
    payment_id, // se usa para crear la order
    external_reference, // va a ser el id de la orden en la db
  } = query(search);

  const [order, setOrder] = useState('');
  useEffect(() => {
    const obj = {
      userId: session.id,
      servicePlanId: planId,
      status: 'active',
      paymentStatus: status,
      paymentId: payment_id,
      id: external_reference,
    };
    axios
      .post(`${REACT_APP_API_BASE_ENDPOINT}/mercadopago/order`, obj)
      .then((r) => {
        setOrder(r.data.id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id]);
  // ======================================================================
  const [postDetails, setPostDetails] = useState({});
  useEffect(() => {
    setPostDetails({
      orderId: external_reference,
      premium: planTitle === 'Premium' ? true : false,
      post_name: '',
      prop_type: '',
      country: '',
      department: '',
      city: '',
      neighborhood: '',
      street_number: '',
      description: '',
      stratum: '',
      price: 0,
      m2: 0,
      rooms: 0,
      bathrooms: 0,
      years: 0,
      pool: false,
      backyard: false,
      gym: false,
      bbq: false,
      parking_lot: false,
      garden: false,
      elevator: false,
      security: false,
      status: 'Available',
      images: [],
      idUser: session.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id]);
  useEffect(() => {
    const postDetailsLocalStorage = localStorage.getItem('postDetails');
    if (!postDetailsLocalStorage) {
      return;
    }
    setPostDetails(JSON.parse(postDetailsLocalStorage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnchangeImage = (imageList) => {
    setPostDetails({ ...postDetails, images: imageList });
  };
  const handleOnInputsChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    setPostDetails(
      valueTypes({
        ...postDetails,
        [name]: value,
        idUser: session.id,
        orderId: external_reference,
      })
    );
    // localStorage.setItem('postDetails', JSON.stringify(postDetails));
  };

  const steps = [
    {
      title: 'Elige tu plan',
      content: <MercadoPago />,
    },
    {
      title: 'Características',
      content: <SecondStep />,
    },
    {
      title: 'Ubicación',
      content: <ThirdStep />,
    },
    {
      title: 'Imágenes',
      content: <FourthStep />,
    },
    {
      title: 'Adicionales',
      content: <FifthStep />,
    },
    {
      title: 'Checkout',
      content: <SixthStep />,
    },
  ];

  return (
    <CreatePostContext.Provider
      value={{
        routerProps,
        postDetails,
        setPostDetails,
        handleOnInputsChange,
        handleOnchangeImage,
        current,
        setCurrent,
        steps,
        infoPlan,
        setInfoPlan,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostProvider;
