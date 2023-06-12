// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Voting {
    enum VotingState {
        Onboarding,
        Voting,
        VotingCompleted
    }

    struct CandidateInfo {
        string partyname;
        string partyflagurl;
        address candidateaddress;
        bool initialized;
    }

    CandidateInfo[] _candidates;
    mapping(address => address[]) _votes;
    mapping(address => CandidateInfo) _votesFor;
    VotingState public _votingState;
    CandidateInfo public _winner;

    // fix the user who can onboard other candidates
    address public _admin;

    constructor() {
        _admin = msg.sender;
        resetState();
    }

    // state functions
    function getCandidates() public view returns (CandidateInfo[] memory) {
        return _candidates;
    }

    function getVoteCountsByCandidate()
        public
        view
        returns (CandidateInfo[] memory, uint256[] memory)
    {
        uint256[] memory votes = new uint256[](_candidates.length);
        CandidateInfo[] memory candidates = new CandidateInfo[](
            _candidates.length
        );

        for (uint256 i = 0; i < _candidates.length; i++) {
            CandidateInfo memory c = _candidates[i];
            candidates[i] = c;
            votes[i] = _votes[c.candidateaddress].length;
        }
        return (candidates, votes);
    }

    function resetState() public {
        _votingState = VotingState.Onboarding;

        // add two test candidates
        addCandidate(
            "BJP",
            "https://www.flagcolorcodes.com/data/Flag-of-Bharatiya-Janata-Party.png",
            0xC69DA2E23f5b7fE69CfBA0E31977064Cf66761a2
        );
        addCandidate(
            "Congress",
            "https://www.flagcolorcodes.com/data/Flag-of-Indian-National-Congress.png",
            0x28F6AE3B7A8C1E7E143456f14f8d98885a53fd8F
        );
        addCandidate(
            "Trinamool Congress",
            "https://www.flagcolorcodes.com/data/Flag-of-All-India-Trinamool-Congress.png",
            0x0a5d46e40A9fD2c5134Dc2aC7C9990d61B6443e3
        );
    }

    event OnNewCandidate(address indexed sender, CandidateInfo candidate);
    event StartVoting(address indexed sender);
    event OnVote(address indexed sender, CandidateInfo candidate);

    function addCandidate(
        string memory partyName,
        string memory partyFlagUrl,
        address candidateAddress
    ) public returns (CandidateInfo memory) {
        require(
            _votingState == VotingState.Onboarding,
            "Voting onboarding is already completed, cannot onboard new candidate"
        );

        // check if candidate already exists
        for (uint256 i = 0; i < _candidates.length; i++) {
            CandidateInfo memory current = _candidates[i];
            if (current.candidateaddress == candidateAddress) {
                revert("Candidate is already registered");
            }
        }

        CandidateInfo memory newCandidate = CandidateInfo(
            partyName,
            partyFlagUrl,
            candidateAddress,
            true
        );
        _candidates.push(newCandidate);
        return newCandidate;
    }

    function startVoting() public {
        require(
            _votingState == VotingState.Onboarding,
            "cannot start voting at this moment"
        );
        _votingState = VotingState.Voting;
    }

    function vote(address candidateAddress) public returns (bool) {
        require(
            _votingState == VotingState.Voting,
            "Voting onboarding is already completed, cannot onboard new candidate"
        );

        address sender = msg.sender;
        CandidateInfo memory votedFor = _votesFor[sender];
        require(
            votedFor.initialized == false,
            "Voting already done, cannot vote again"
        );

        // check if candidate already exists
        for (uint256 i = 0; i < _candidates.length; i++) {
            CandidateInfo memory c = _candidates[i];
            if (c.candidateaddress == candidateAddress) {
                address[] storage votes = _votes[candidateAddress];
                votes.push(sender);
                _votesFor[sender] = c;
                return true;
            }
        }

        revert("No candidates are registered with the given details");
    }

    function getMyVote() public view returns (CandidateInfo memory) {
        return _votesFor[msg.sender];
    }

    function getVotingResults()
        public
        view
        returns (CandidateInfo[] memory, uint256[] memory)
    {
        require(
            _votingState == VotingState.Voting,
            "cannot get voting results when voting is not in progress"
        );

        CandidateInfo[] memory candidates = new CandidateInfo[](
            _candidates.length
        );
        uint256[] memory votes = new uint256[](_candidates.length);
        for (uint256 i = 0; i < _candidates.length; i++) {
            CandidateInfo memory c = _candidates[i];
            candidates[i] = c;
            votes[i] = _votes[c.candidateaddress].length;
        }

        return (candidates, votes);
    }

    function declareVotingResults() public {
        require(
            _votingState == VotingState.Voting,
            "cannot declare winner at the moment"
        );
        _votingState = VotingState.VotingCompleted;

        CandidateInfo memory winner;
        uint256 winVotesCount = 0;
        for (uint256 i = 0; i < _candidates.length; i++) {
            CandidateInfo memory c = _candidates[i];
            uint256 votesCount = _votes[c.candidateaddress].length;
            if (votesCount > winVotesCount) {
                winner = c;
                votesCount = winVotesCount;
            }
        }

        _winner = winner;
    }

    function getWinner() public view returns (CandidateInfo memory) {
        require(
            _votingState == VotingState.VotingCompleted,
            "voting is not completed yet to declare winner"
        );

        return _winner;
    }
}
