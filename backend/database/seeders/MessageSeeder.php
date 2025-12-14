<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    protected array $partRequestMessages = [
        'buyer' => [
            'Hi, do you have this part available?',
            'What condition is the part in?',
            'Can you send me some photos?',
            'Is the price negotiable?',
            'How quickly can you ship it?',
            'Is this an OEM part or aftermarket?',
            'Does it come with any warranty?',
            'Perfect, I am interested!',
            'Can you provide the part number?',
            'Thanks for the quick response!',
        ],
        'seller' => [
            'Yes, I have this part in stock!',
            'The part is in excellent condition, barely used.',
            'I can ship it out within 1-2 business days.',
            'Sure, I can offer a small discount for quick payment.',
            'This is an original OEM part from Germany.',
            'I will send you photos shortly.',
            'Yes, it comes with a 6-month warranty.',
            'The part number is printed on the box, I will check.',
            'Let me know if you have any other questions!',
            'Great, I will prepare the invoice for you.',
        ],
    ];

    protected array $carListingMessages = [
        'buyer' => [
            'Hi, is this car still available?',
            'Can I schedule a test drive?',
            'What is the service history like?',
            'Are there any scratches or dents?',
            'Has it been in any accidents?',
            'Is the price negotiable?',
            'Can you provide more photos of the interior?',
            'When would be a good time to view the car?',
            'Does it have a full service record?',
            'Thanks for the information!',
        ],
        'seller' => [
            'Yes, the car is still available!',
            'Absolutely, when would you like to come by?',
            'Full service history at authorized dealer.',
            'The car is in excellent condition, no accidents.',
            'I can send you more photos this evening.',
            'There is some room for negotiation.',
            'The car has been garage-kept since new.',
            'You are welcome to visit anytime this weekend.',
            'I have all the maintenance records available.',
            'Looking forward to meeting you!',
        ],
    ];

    public function run(): void
    {
        $conversations = Conversation::all();

        foreach ($conversations as $conversation) {
            $messageCount = fake()->numberBetween(3, 8);
            $isPartRequest = $conversation->context_type === 'part_request';
            $messages = $isPartRequest ? $this->partRequestMessages : $this->carListingMessages;

            // Determine who is buyer and who is seller
            $participantOne = $conversation->participantOne;
            $participantTwo = $conversation->participantTwo;

            $buyer = $participantOne->user_type === 'buyer' ? $participantOne : $participantTwo;
            $seller = $participantOne->user_type === 'seller' ? $participantOne : $participantTwo;

            $currentTime = $conversation->created_at;

            for ($i = 0; $i < $messageCount; $i++) {
                // Alternate between buyer and seller, starting with buyer
                $isBuyerMessage = $i % 2 === 0;
                $sender = $isBuyerMessage ? $buyer : $seller;
                $role = $isBuyerMessage ? 'buyer' : 'seller';

                // Pick a random message from the appropriate pool
                $content = fake()->randomElement($messages[$role]);

                // Add some time between messages
                $currentTime = fake()->dateTimeBetween($currentTime, '+2 hours');

                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $sender->id,
                    'content' => $content,
                    'is_read' => $i < $messageCount - 1 ? true : fake()->boolean(50),
                    'created_at' => $currentTime,
                    'updated_at' => $currentTime,
                ]);
            }

            // Update conversation's last_message_at
            $conversation->update(['last_message_at' => $currentTime]);
        }
    }
}
