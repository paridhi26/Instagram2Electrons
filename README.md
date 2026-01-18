# Instagram to Electrons
An interactice simulator that simulates how online identity travels on the internet. 
--
**Instagram to Electrons** is an interactive visualization that shows what actually happens when you upload a photo to social media — from the moment you press **Share** to the moment the data reaches Instagram’s infrastructure.

Online identity feels personal, but it is carried by a vast physical system. This project makes that system visible.



## What this project shows

When you upload a photo, you usually see one thing: a progress bar.

This project answers the question:

**What does that progress bar actually represent?**

As you scroll down the stack, the upload progresses — revealing how a single image becomes bytes, packets, signals, and finally a stored object on Instagram’s servers.



## The journey (end to end)

### 1. Application layer — preparing the upload

- You select a photo and press **Share**.
- The Instagram app reads the image file (already stored as compressed bytes).
- The app may resize or re-encode the image.
- An **HTTP POST request** is constructed containing the image bytes.
- All of this happens inside the application process (user space).

At this point, nothing has touched the network yet — only bytes exist in memory.



### 2. OS boundary — handing bytes to the kernel

- The app calls a native networking API.
- The byte stream is written to a **TCP socket**.
- This crosses the boundary from user space into the operating system.

From here on, the application is done. The OS takes over.



### 3. Transport layer (TCP) — reliability

- The operating system treats the upload as a stream of bytes.
- An 819 KB image is **split into hundreds of TCP segments**.
- Each segment carries sequence numbers and acknowledgements.
- Lost segments are retransmitted automatically.

TCP ensures the full image arrives intact and in order.



### 4. Network layer (IP) — routing

- Each TCP segment is wrapped in an **IP packet**.
- The packet includes:
  - source IP (your device)
  - destination IP (Instagram)
- The OS consults its routing table to decide the **next hop**.

TCP cares about correctness.  
IP cares about direction.



### 5. Data link layer — local delivery

- The OS must deliver the packet to the next hop (usually your router).
- It resolves the router’s **MAC address** using ARP.
- The IP packet is wrapped in a **link-layer frame** addressed to the router.
- MAC addresses are only used locally and change at every hop.


### 6. Physical layer — bits become signals

The frame is transmitted as physical signals, depending on the medium:

- **Wi-Fi / Cellular:** radio waves  
- **Ethernet:** electrical signals  
- **Fiber (later in the path):** light (photons)

At this point, data is no longer abstract — it is physics.



### 7. Routers — hop-by-hop forwarding

At each router:

1. The link-layer frame is received.
2. The router strips the link header.
3. It examines the destination IP.
4. It consults its routing table.
5. It creates a new link-layer frame for the next hop.

Key insight:

> **IP addresses stay the same end-to-end.  
> MAC addresses change at every hop.**

This process repeats across home routers, ISPs, backbone networks, and peering points.



### 8. Instagram infrastructure — arrival

- Packets reach Instagram’s edge network.
- TCP reassembles the original byte stream.
- The server receives the full image upload.
- The image is stored, processed, and prepared for feeds.

Your identity is now shared.



## What this project is (and isn’t)

This project is **not** a packet-level simulator or a full networking implementation yet. That is not doable by a solo person team at a hackathon. We are talking decades of engineering. 

It is a **conceptual, end-to-end visualization** that shows:
- what data exists at each layer
- who is responsible at each step
- how abstraction boundaries fit together

Many entire projects can be built on just one protocol.  
This project’s goal is to show **how they all work together**.



## Why this matters

Most people experience the internet only at the interface layer.

But every photo, message, and post depends on:
- operating systems
- routing tables
- network hardware
- electromagnetic physics

Understanding this stack changes how you see technology.


## Built with

- Next.js (frontend)
- Client-side state and animations
- Conceptual models inspired by real OS and networking stacks



## Final note

This visualization simplifies many details.  
The real internet is far more complex — and that complexity is the result of **decades of engineering**.

This project is an attempt to make that complexity understandable.
