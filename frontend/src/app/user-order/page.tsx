"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import starsBg from "@/assets/stars.png";
import Image from "next/image";
import api from "@/services/axios";
import {motion} from "framer-motion";

// Definir interfaces para los tipos de datos
interface Item {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items?: Item[]; // Hacer items opcional
  totalPrice: number;
}

const CartPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No auth token found. Please login.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get("/orders", config);
        console.log("Fetched orders:", response.data); // Log para verificar la respuesta
        setOrders(response.data);
      } catch (err) {
        setError("Error fetching orders.");
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <motion.div
        className="min-h-screen"
        style={{
          backgroundImage: `url(${starsBg.src})`,
        }}
        animate={{
          backgroundPositionX: starsBg.width,
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <section className="container flex justify-center p-10">
          {/* Contenedor para Órdenes */}
          <div className="md:w-2/3 p-6 rounded-lg bg-[radial-gradient(90%_70%_at_center_center,rgb(140,69,255,0.5)_15%,rgb(14,0,36,-5)_78%,transparent)]">
            <h2 className="text-6xl tracking-tighter font-bold text-white mb-4">
              Your Orders
            </h2>
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col gap-2 p-6 border-b border-white/15"
                >
                  {/* Order ID y View Details */}
                  <div className="flex justify-between items-center ">
                    <p className="text-lg text-white/80">
                      Order ID: {order._id}
                    </p>
                    
                  </div>
                  <div className="flex justify-end items-center">
                      <a
                        href={`/orderdetails/${order._id}`}
                        style={{
                          color: "#ffffff",
                          textShadow: "2px 2px 12px #ffffff",
                        }}
                      >
                        View Details
                      </a>
                    </div>
                  {/* Items de la Orden */}
                  {order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-xl bg-black/25"
                        />
                        <div className="flex-grow">
                          <h3 className="text-lg text-white">{item.name}</h3>
                          <p className="text-white/50">
                            ${item.price.toFixed(2)} x {item.qty}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50">
                      No items found in this order.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-white/50">No orders found.</p>
            )}
          </div>
        </section>
      </motion.div>
      <Footer />
    </>
  );
};

export default CartPage;
