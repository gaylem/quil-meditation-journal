//** HOW TO MEDITATE PAGE */

import React from 'react';
import ContactForm from '../components/ContactForm.jsx';

/**
 * React component for the How to Meditate page.
 *
 * This page provides instructions for meditation.
 * It includes details about the techniques and further reading.
 * There is a contact form at the end.
 *
 * @returns {JSX.Element} The rendered About page component.
 */
const Meditate = () => {
  return (
    <div className='pageContainer'>
      <div className='pageContent'>
        <h2>How To Meditate</h2>
        <p>
          <span className='purple'>&quot;I&apos;m terrible at meditation!&quot;</span> That&apos;s something many people say when the subject comes up. And the correct response is, &quot;Yes, you are!&quot; But that&apos;s because{' '}
          <span className='purple'>
            we <i>all</i> are
          </span>
          . The truth is, meditation is about showing up each day to practice without expectations. Even long-time meditators will be the first to tell you that the learning process never ends, and there&apos;s always room to grow.
        </p>
        <br />
        <p>
          The more you meditate, the less you worry about how &quot;good&quot; you are at it and the more you see that a willingness to persevere is key. And what matters even more is the gift you are giving to yourself: <span className='purple'>the chance to just be, with compassion and without judgement.</span>
        </p>
        <br />
        <p>
          If you&apos;ve never meditated before, or you need a little refresher, <span className='purple'>review the instructions below.</span> They will provide you with a simple way to start your practice. Additional resources are also provided below if you&apos;d like to expand your learning.
        </p>
        <br />
        <h2>Preparation</h2>
        <ol>
          <li>
            <span className='purple'>Find a quiet place where you won&apos;t be disturbed during your meditation.</span> If that place is in the bathroom because that&apos;s the only way your family or roommates will leave you alone, that will do just fine.
          </li>
          <br />
          <li>
            <span className='purple'>Sit comfortably and with a &quot;straight&quot; spine.</span> That means different things for different people, so feel free to experiment. Do you prefer sitting cross-legged on a cushion, or in a chair with your feet on the ground? Is the couch calling to you? Lying down is also acceptable, as long as you won&apos;t fall asleep (the only exception being if you are meditating at bedtime to get a good night&apos;s rest). You can also stand if you need to. The point is, there isn&apos;t one right way to go about this, so don&apos;t let disabilities or discomfort come between you and your practice. Get creative if you have to, and find what works for you.
          </li>
          <br />
          <li>
            Feel free to <span className='purple'>close your eyes, or keep them slightly open</span> while gazing gently downward if that&apos;s more comfortable for you.
          </li>
          <br />
          <li>
            <span className='purple'>Remind yourself why you are meditating.</span> Is it to be more present with your kids? Reduce anxiety? Grow spiritually? Manage depression? All reasons are valid, and remembering yours will help you stay motivated.
          </li>
          <br />
          <li>
            <span className='purple'>When you&apos;re ready, begin by taking a few deep breaths to relax.</span> Notice any sounds or smells around you and allow your awareness of your surroundings to increase as you become present with them.
          </li>
        </ol>
        <br />
        <h2>Basic Techniques</h2>
        <ol>
          <li>
            <span className='purple'>Connect.</span> Begin by scanning from the top of your head and move downward through your entire body, observing sensations in each part without judgement.
            <ul>
              <li>If you need to stretch or scrunch your face or roll your shoulders out, go ahead.</li>
              <li>If you notice self-criticisms or other thoughts pop up, observe them but don&apos;t engage. Let them come and go.</li>
              <li>If you experience pain or discomfort, observe it and any emotions that arise because of the pain without reacting to them.</li>
              <li>Lastly, notice as your session progresses if any sensations that were once intense diminish over time, or vice versa.</li>
            </ul>
          </li>
          <br />
          <li>
            <span className='purple'>Focus on your breath.</span> When you finish your body scan, bring your attention to your breath. Ideally, you&apos;ll breathe in and out through your nose from this point on if you can. Breathing through the mouth tends to increase anxiety, rather than decrease it.
            <ul>
              <li>First feel the breath move throughout your body, entering your nose and then moving like a wave down into your lungs. Feel the rise and fall of your stomach. </li>
              <li>Then gently begin to focus your attention on the breath around your nostrils.</li>
              <li>As you may have noticed, you have been gradually narrowing our focus from our surroundings to your body, then from your body to your breath, and now from the breath generally to the specific sensation around your nostrils.</li>
              <li>You can also try counting the breaths if it will help you maintain focus. </li>
              <li>If a distracting sound pops up, rather than get angry or annoyed by it, work it into your meditation by observing it. (But if the sound indicates an emergency of some kind, attend to it.)</li>
            </ul>
          </li>
          <br />
          <li>
            <span className='purple'>Return to your breath.</span> If your mind wanders (and it will), notice it happening and then gently bring it back to your breath without judgment.
            <ul>
              <li>Over time, you will notice your mind wandering more. You may begin to feel frustrated and say things to yourself like, &quot;I just can&apos;t do this right.&quot;</li>
              <li>Remind yourself that noticing your mind wandering and returning to the breath are sufficient, and over time, your mind will wander less and less.</li>
              <li>
                <span className='purple'>The goal at this phase is to strengthen your observational skills, not to entirely eliminate your thoughts.</span>
              </li>
            </ul>
          </li>
          <br />
          <li>
            <span className='purple'>Reflect.</span> When your meditation time is complete, bring your attention back to your breath for a few moments before slowly opening your eyes.
            <ul>
              <li>Take a moment to observe any changes in the state of your mind and body.</li>
              <li>
                If you like, <span className='purple'>use quil to jot down some notes about your experience.</span>
              </li>
            </ul>
          </li>
        </ol>
        <br />
        <h2>Additional Meditation Techniques</h2>
        <ol>
          <li>
            <span className='purple'>Loving-Kindness Meditation (Metta).</span> You can incorporate this practice into your meditation session if you like.
            <ul>
              <li>It involves repeating mantras such as &quot;May I be happy&quot; or &quot;May you be healthy&quot; and extending those wishes to yourself, loved ones, and even people you dislike. You can create your own mantras or find more traditional ones if you prefer.</li>
              <li>You can also include visualizations, such as seeing a warm glowing light expanding from your heart over your entire body and then out into the world.</li>
            </ul>
          </li>
          <br />
          <li>
            <span className='purple'>Walking Meditation.</span> For this one, you&apos;re going to want to keep your eyes open!
            <ul>
              <li>Walk at a slower pace than usual and try to maintain an upright but relaxed posture.</li>
              <li>Really feel the sensations of your feet and observe your surroundings. Sync your breath with your steps by inhaling for a certain number of steps, and then exhaling for a certain number of steps.</li>
              <li>Observe your thoughts as usual and if you get distracted from the present moment, bring your attention back to your breath and steps.</li>
            </ul>
          </li>
        </ol>
        <br />
        <h2>How often should I meditate?</h2>
        <p>Regular, consistent practice is better than the occasional lengthy meditation session.</p>
        <ul>
          <li>
            <span className='purple'>Choose a time during the day when you are least likely to be disturbed.</span> Often meditating first thing in the morning is best because there is usually nothing to distract you.
          </li>
          <li>
            <span className='purple'>Start with 5 minutes, and then gradually expand to 10 minutes or more.</span> If all you can squeeze in each day is 10 minutes, that&apos;s just fine. If you decide to extend the time to a longer duration, do so gradually so you don&apos;t overwhelm yourself.
          </li>
        </ul>
        <br />
        <h2>Further Reading</h2>
        <p>If you want to continue learning about meditation, here are a few books that may help:</p>
        <br />
        <ul>
          <li>
            <a href='https://www.goodreads.com/book/show/32895535'>Why Buddhism is True</a> by Robert Wright. This book doesn&apos;t make any grand claims about the religious side of Buddhism. Rather, it&apos;s a scientific and philosophical look at the practices of Buddhism and it describes the author&apos;s attempt to gauge their efficacy at addressing the human condition. Really, it would be more accurately titled <i>Why Buddhist Practices Work</i>.
          </li>
          <li>
            <a href='https://www.goodreads.com/en/book/show/25942786'>The Mind Illuminated</a> by John Yates. This book is for the serious student and outlines many pitfalls and considerations a practitioner should make at various phases of their meditation journey.
          </li>
          <li>
            Anything by <a href='https://www.goodreads.com/author/list/9074.Thich_Nhat_Hanh'>Thich Nhat Hanh</a>.
          </li>
        </ul>
        <br />
        <h2>Questions? Book Recommendations?</h2>
        <p>Feel free to reach out through the form below!</p>
        <br />
        <ContactForm />
      </div>
    </div>
  );
};

export default Meditate;
