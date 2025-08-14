module MyModule_addr::MemeContestV2 {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::vector;

    /// Struct representing a meme contest with submissions and voting
    struct Contest has store, key {
        meme_submissions: vector<address>,  // List of meme submitters
        votes: vector<u64>,                 // Vote counts for each submission
        prize_pool: u64,                    // Total prize pool for winners
        submission_fee: u64,                // Fee required to submit a meme
    }

    /// Function to create a new meme contest with submission fee and initial prize
    public fun create_contest(
        organizer: &signer, 
        submission_fee: u64, 
        initial_prize: u64
    ) {
        let contest = Contest {
            meme_submissions: vector::empty<address>(),
            votes: vector::empty<u64>(),
            prize_pool: initial_prize,
            submission_fee,
        };
        move_to(organizer, contest);
    }

    /// Function to submit a meme to the contest and vote for existing submissions
    public fun submit_and_vote(
        participant: &signer, 
        contest_owner: address, 
        vote_for_index: u64
    ) acquires Contest {
        let contest = borrow_global_mut<Contest>(contest_owner);
        let participant_addr = signer::address_of(participant);
        
        // Collect submission fee and add to prize pool
        let fee_payment = coin::withdraw<AptosCoin>(participant, contest.submission_fee);
        coin::deposit<AptosCoin>(contest_owner, fee_payment);
        contest.prize_pool = contest.prize_pool + contest.submission_fee;
        
        // Add participant's meme submission
        vector::push_back(&mut contest.meme_submissions, participant_addr);
        vector::push_back(&mut contest.votes, 0);
        
        // Vote for an existing submission if valid index provided
        let submissions_count = vector::length(&contest.votes);
        if (vote_for_index < submissions_count) {
            let current_votes = vector::borrow_mut(&mut contest.votes, vote_for_index);
            *current_votes = *current_votes + 1;
        };
    }
}