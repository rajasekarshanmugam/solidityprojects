// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract AuctionHouse {
    enum AuctionState {
        Created,
        Started,
        Frozen,
        Closed
    }

    struct Auction {
        uint256 id;
        string itemName;
        string itemUrl;
        string itemDescription;
        uint256 minimumPriceWei;
        address payable owner;
        AuctionState state;
        address winningBidder;
        uint256 winningBidPriceWei;
    }

    uint256 _auctionIdCounter;
    uint256[] _auctionIds;
    mapping(uint256 => Auction) _auctions;
    mapping(address => uint256[]) _userAuctions;

    address _houseAddress;

    constructor() {
        _houseAddress = msg.sender;

        // create sample data
        createAuction(
            "watch",
            "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat ac viverra sed, volutpat eget ante. Integer sit amet elit libero. Donec eleifend nec nibh a varius. Proin et erat mollis urna maximus ultrices. Vestibulum ac arcu nec turpis pellentesque pellentesque vitae vel dolor. Sed suscipit leo ipsum, eu dapibus diam imperdiet ut",
            1000
        );
        createAuction(
            "item1",
            "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat ac viverra sed, volutpat eget ante. Integer sit amet elit libero. Donec eleifend nec nibh a varius. Proin et erat mollis urna maximus ultrices. Vestibulum ac arcu nec turpis pellentesque pellentesque vitae vel dolor. Sed suscipit leo ipsum, eu dapibus diam imperdiet ut",
            2000
        );
    }

    function createAuction(
        string memory itemName,
        string memory itemUrl,
        string memory itemDescription,
        uint256 minimumPriceWei
    ) public returns (Auction memory) {
        Auction memory a = Auction(
            ++_auctionIdCounter,
            itemName,
            itemUrl,
            itemDescription,
            minimumPriceWei,
            payable(msg.sender),
            AuctionState.Created,
            address(0),
            minimumPriceWei
        );
        _auctionIds.push(a.id);
        _auctions[a.id] = a;
        _userAuctions[msg.sender].push(a.id);
        return a;
    }

    function getAuctions() public view returns (Auction[] memory) {
        Auction[] memory auctions = new Auction[](_auctionIds.length);
        for (uint256 i = 0; i < _auctionIds.length; i++) {
            auctions[i] = _auctions[_auctionIds[i]];
        }
        return auctions;
    }

    function getAuction(uint256 id) public view returns (Auction memory) {
        return _auctions[id];
    }

    modifier onlyAuctionOwner(uint256 id) {
        Auction memory a = _auctions[id];
        require(a.owner == msg.sender, "Only auction owner can change values");
        _;
    }

    modifier notAuctionOwner(uint256 id) {
        Auction memory a = _auctions[id];
        require(
            a.owner != msg.sender,
            "Only NON-auction owners can perform this action"
        );
        _;
    }

    modifier onlyBuyer(uint256 id) {
        Auction memory a = _auctions[id];
        require(
            a.winningBidder == msg.sender,
            "Only winning bidder can perform this action"
        );
        _;
    }

    function updateAuction(
        uint256 id,
        string memory itemName,
        string memory itemUrl,
        uint256 minimumPriceWei
    ) public onlyAuctionOwner(id) returns (Auction memory) {
        Auction storage a = _auctions[id];

        // validations
        require(
            a.state == AuctionState.Created,
            "can edit auction item details only when its in created state"
        );

        a.itemName = itemName;
        a.itemUrl = itemUrl;
        a.minimumPriceWei = minimumPriceWei;
        return a;
    }

    function startBidding(uint256 id)
        public
        onlyAuctionOwner(id)
        returns (Auction memory)
    {
        Auction storage a = _auctions[id];

        // validations
        require(
            a.state == AuctionState.Created,
            "can start bid of auction only when its in created state"
        );

        a.state = AuctionState.Started;
        return a;
    }

    function bid(uint256 id, uint256 bidAmount)
        public
        notAuctionOwner(id)
        returns (Auction memory)
    {
        Auction storage a = _auctions[id];

        // validations
        require(
            a.state == AuctionState.Started,
            "can bid only after auction has started"
        );

        if (bidAmount < a.winningBidPriceWei) {
            revert(
                "bid amount must be greater than current winning bid amount"
            );
        }

        a.winningBidder = msg.sender;
        a.winningBidPriceWei = bidAmount;
        return a;
    }

    function freezeAuction(uint256 id)
        public
        onlyAuctionOwner(id)
        returns (Auction memory)
    {
        Auction storage a = _auctions[id];

        // validations
        require(
            a.state == AuctionState.Started,
            "can freeze auction only after auction has started"
        );

        a.state = AuctionState.Frozen;
        return a;
    }

    function buyAndConfirmSale(uint256 id)
        public
        payable
        onlyBuyer(id)
        returns (Auction memory)
    {
        Auction storage a = _auctions[id];

        // validations
        require(
            a.state == AuctionState.Frozen,
            "can buy and  auction only after auction has been frozen"
        );

        bool sent = a.owner.send(a.winningBidPriceWei);
        require(sent, "Failed to send ether to the owner, aborting buy");

        a.state = AuctionState.Closed;
        return a;
    }

    function transfer(address payable to, uint value)
        public
        payable
    {
        //bool sent = to.send(value);
        (bool sent,) = to.call{value: value}("");
        require(sent, "Failed to send ether to the owner, aborting buy");
    }

    function balance()
        public
        view
        returns (uint)
    {
        return payable(msg.sender).balance;
    }
}
