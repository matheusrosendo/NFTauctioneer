const request = require("supertest");
const promiseApp = require("../app.js");
const Util = require("commonutils");

let app
beforeAll(async () => {
    app = await Promise.resolve(promiseApp);
    await Util.sleep(500);
});

describe("User Endpoints", () =>{
    
    test("should be able to insert a User record on database", async() =>{    
        const response = await request(app).post("/api/auction/user/").send({
            id: "0",
            address: "0xabcd123456...",
            description: "user abdc",
            admin: 0
        })
        expect(response.body.id).toBe("0")
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a second User record on database", async() =>{    
        const response = await request(app).post("/api/auction/user/").send({
            id: "1",
            address: "0xabcd2222222...",
            description: "user abdc 2222",
            admin: 1
        })
        expect(response.body.id).toBe("1")
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a third User record on database", async() =>{    
        const response = await request(app).post("/api/auction/user/").send({
            id: "2",
            address: "0xabcd2222222...",
            description: "user abdc 333",
            admin: 0
        })
        expect(response.body.id).toBe("2")
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to update a User record on database", async() =>{    
        const response = await request(app).put("/api/auction/user/1").send({
            id: "1",
            address: "0xabcd2222222...",
            description: "user id 1 altered",
            admin: 0
        })
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve three User records from database", async() =>{    
        const response = await request(app).get("/api/auction/user/").send()
        return expect(response.body.length).toBe(3)
    })

    test("should be able to delete the second User record from database", async() =>{    
        const response = await request(app).delete("/api/auction/user/2").send()
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve two User record from database", async() =>{    
        const response = await request(app).get("/api/auction/user/").send()
        return expect(response.body.length).toBe(2)
    }) 

})
 
describe("AuctionManager Endpoints", () =>{
    test("should be able to insert a AuctionManager record on database", async() =>{    
        const response = await request(app).post("/api/auction/auctionManager/").send({
            address: "0x123456...",
            tx: "0xabcd123456...",
            userId: 1
        })
        expect(response.body.id).toBe(1)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a second AuctionManager record on database", async() =>{    
        const response = await request(app).post("/api/auction/auctionManager/").send({
            address: "0x222222222...",
            tx: "0xabcd2222222...",
            userId: 1
        })
        expect(response.body.id).toBe(2)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to update a AuctionManager record on database", async() =>{    
        const response = await request(app).put("/api/auction/auctionManager/2").send({
            address: "0xaltered...",
            tx: "0xabcdaltered...",
            userId: 1
        })
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve two AuctionManager records from database", async() =>{    
        const response = await request(app).get("/api/auction/auctionManager/").send()
        return expect(response.body.length).toBe(2)
    })

    test("should be able to delete the second AuctionManager record from database", async() =>{    
        const response = await request(app).delete("/api/auction/auctionManager/2").send()
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve one AuctionManager record from database", async() =>{    
        const response = await request(app).get("/api/auction/auctionManager/").send()
        return expect(response.body.length).toBe(1)
    })
}) 
 
describe("NFTcollection Endpoints", () =>{
    test("should be able to insert a NFTcollection record on database", async() =>{    
        const response = await request(app).post("/api/auction/NFTcollection/").send({
            address: "0x123456...",
            tx: "0xabcd123456...",
            userId: 1
        })
        expect(response.body.id).toBe(1)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a second NFTcollection record on database", async() =>{    
        const response = await request(app).post("/api/auction/NFTcollection/").send({
            address: "0x222222222...",
            tx: "0xabcd2222222...",
            userId: 1
        })
        expect(response.body.id).toBe(2)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to update a NFTcollection record on database", async() =>{    
        const response = await request(app).put("/api/auction/NFTcollection/2").send({
            address: "0xaltered...",
            tx: "0xabcdaltered...",
            userId: 1
        })
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve two NFTcollection records from database", async() =>{    
        const response = await request(app).get("/api/auction/NFTcollection/").send()
        return expect(response.body.length).toBe(2)
    })

    test("should be able to delete the second NFTcollection record from database", async() =>{    
        const response = await request(app).delete("/api/auction/NFTcollection/2").send()
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve one NFTcollection record from database", async() =>{    
        const response = await request(app).get("/api/auction/NFTcollection/").send()
        return expect(response.body.length).toBe(1)
    })
})


describe("MintedNFT Endpoints", () =>{
    test("should be able to insert a MintedNFT record on database", async() =>{    
        const response = await request(app).post("/api/auction/mintedNFT/").send({
            tx: "0xabcd123456...",
            NFTcollectionId: 1,
            blockchainTokenId: 0
        })
        expect(response.body.id).toBe(1)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a second MintedNFT record on database", async() =>{    
        const response = await request(app).post("/api/auction/mintedNFT/").send({
            tx: "0xabcd2222222...",
            NFTcollectionId: 1,
            blockchainTokenId: 1
        })
        expect(response.body.id).toBe(2)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to update a MintedNFT record on database", async() =>{    
        const response = await request(app).put("/api/auction/mintedNFT/2").send({
            tx: "0xabcdaltered...",
            NFTcollectionId: 1,
            blockchainTokenId: 1
        })
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve two MintedNFT records from database", async() =>{    
        const response = await request(app).get("/api/auction/mintedNFT/").send()
        return expect(response.body.length).toBe(2)
    })

    test("should be able to delete the second MintedNFT record from database", async() =>{    
        const response = await request(app).delete("/api/auction/mintedNFT/2").send()
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve one MintedNFT record from database", async() =>{    
        const response = await request(app).get("/api/auction/mintedNFT/").send()
        return expect(response.body.length).toBe(1)
    })
})

describe("Auction Endpoints", () =>{
    test("should be able to insert a Auction record on database", async() =>{    
        const response = await request(app).post("/api/auction/auction/").send({
            tx: "0xabcd123456...",
            auctionManagerId: 1,
            mintedNFTId: 1,
            blockchainIndex: "0"
        })
        expect(response.body.id).toBe(1)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a second Auction record on database", async() =>{    
        const response = await request(app).post("/api/auction/auction/").send({
            tx: "0xabcd123456... second",
            auctionManagerId: 1,
            mintedNFTId: 1,
            blockchainIndex: "1"
        })
        expect(response.body.id).toBe(2)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to update a Auction record on database", async() =>{    
        const response = await request(app).put("/api/auction/auction/2").send({
            tx: "0xabcd123456... altered",
            auctionManagerId: 1,
            mintedNFTId: 1,
            blockchainIndex: "1"
        })
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve two Auction records from database", async() =>{    
        const response = await request(app).get("/api/auction/auction/").send()
        return expect(response.body.length).toBe(2)
    })

    test("should be able to delete the second Auction record from database", async() =>{    
        const response = await request(app).delete("/api/auction/auction/2").send()
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve one Auction record from database", async() =>{    
        const response = await request(app).get("/api/auction/auction/").send()
        return expect(response.body.length).toBe(1)
    })
})


describe("Bid Endpoints", () =>{
    test("should be able to insert a Bid record on database", async() =>{    
        const response = await request(app).post("/api/auction/bid/").send({
            address: "0x987654321654",
            tx: "0xabcd123456...",
            userId: 1,
            auctionId: 1,
            blockchainIndex: "0"
        })
        expect(response.body.id).toBe(1)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to insert a second Bid record on database", async() =>{    
        const response = await request(app).post("/api/auction/bid/").send({
            address: "0x987654321654 22222",
            tx: "0xabcd123456... 22222",
            userId: 1,
            auctionId: 1,
            blockchainIndex: "1"
        })
        expect(response.body.id).toBe(2)
        return expect(response.statusCode).toBe(200)
    })

    test("should be able to update a Bid record on database", async() =>{    
        const response = await request(app).put("/api/auction/bid/2").send({
            address: "0x987654321654 22222",
            tx: "0xabcd123456... 22222 altered",
            userId: 1,
            auctionId: 1,
            blockchainIndex: "1"
        })
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve two Bid records from database", async() =>{    
        const response = await request(app).get("/api/auction/bid/").send()
        return expect(response.body.length).toBe(2)
    })

    test("should be able to delete the second Bid record from database", async() =>{    
        const response = await request(app).delete("/api/auction/bid/2").send()
        return expect(response.statusCode).toBe(200)
    })

    test("should retrieve one Bid record from database", async() =>{    
        const response = await request(app).get("/api/auction/bid/").send()
        return expect(response.body.length).toBe(1)
    })
})
 


afterAll(async () => {
    // Defer jest result output waiting for stdout to flush
    await Util.sleep(500);
});

  