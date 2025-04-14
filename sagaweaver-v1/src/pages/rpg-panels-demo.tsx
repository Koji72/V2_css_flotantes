import React from 'react';
import Head from 'next/head';
import { EnhancedTable } from '../components/EnhancedTable';
import '../styles/enhanced-table.css';
import '../styles/rpg-columns.css';

// Sample data for character stats
const characterStats = [
  { id: 1, stat: 'Strength', value: 16, modifier: '+3', description: 'Physical power and carrying capacity' },
  { id: 2, stat: 'Dexterity', value: 14, modifier: '+2', description: 'Agility, reflexes, and balance' },
  { id: 3, stat: 'Constitution', value: 15, modifier: '+2', description: 'Health, stamina, and vital force' },
  { id: 4, stat: 'Intelligence', value: 12, modifier: '+1', description: 'Mental acuity, information recall' },
  { id: 5, stat: 'Wisdom', value: 10, modifier: '±0', description: 'Awareness, intuition, and insight' },
  { id: 6, stat: 'Charisma', value: 13, modifier: '+1', description: 'Force of personality, persuasiveness' },
];

// Sample data for equipment
const equipment = [
  { id: 1, item: 'Steel Longsword', type: 'Weapon', damage: '1d8+3', weight: 3, properties: 'Versatile (1d10)', highlighted: true },
  { id: 2, item: 'Shortbow', type: 'Weapon', damage: '1d6+2', weight: 2, properties: 'Range (80/320)' },
  { id: 3, item: 'Chain Mail', type: 'Armor', damage: '', weight: 55, properties: 'AC 16, Disadvantage on Stealth' },
  { id: 4, item: 'Adventurer\'s Pack', type: 'Gear', damage: '', weight: 10, properties: 'Contains basic survival equipment' },
  { id: 5, item: 'Potion of Healing', type: 'Consumable', damage: '', weight: 0.5, properties: 'Restores 2d4+2 hit points' },
];

// Column definitions for character stats
const statColumns = [
  { key: 'stat', header: 'Attribute' },
  { key: 'value', header: 'Score' },
  { key: 'modifier', header: 'Mod' },
  { key: 'description', header: 'Description' },
];

// Column definitions for equipment
const equipmentColumns = [
  { key: 'item', header: 'Item' },
  { key: 'type', header: 'Type' },
  { key: 'damage', header: 'Damage' },
  { key: 'weight', header: 'Weight' },
  { key: 'properties', header: 'Properties' },
];

// Example skills section content
const CharacterSkills = () => (
  <div className="character-skills">
    <h2>Character Skills</h2>
    <ul>
      <li><strong>Acrobatics:</strong> +5 (Proficient)</li>
      <li><strong>Animal Handling:</strong> +0</li>
      <li><strong>Arcana:</strong> +1</li>
      <li><strong>Athletics:</strong> +6 (Expertise)</li>
      <li><strong>Deception:</strong> +1</li>
      <li><strong>History:</strong> +1</li>
      <li><strong>Insight:</strong> +0</li>
      <li><strong>Intimidation:</strong> +4 (Proficient)</li>
      <li><strong>Investigation:</strong> +1</li>
      <li><strong>Medicine:</strong> +0</li>
      <li><strong>Nature:</strong> +1</li>
      <li><strong>Perception:</strong> +3 (Proficient)</li>
      <li><strong>Performance:</strong> +1</li>
      <li><strong>Persuasion:</strong> +1</li>
      <li><strong>Religion:</strong> +1</li>
      <li><strong>Sleight of Hand:</strong> +2</li>
      <li><strong>Stealth:</strong> +5 (Proficient)</li>
      <li><strong>Survival:</strong> +3 (Proficient)</li>
    </ul>
  </div>
);

// Character background section
const CharacterBackground = () => (
  <div className="character-background">
    <h2>Character Background</h2>
    <p>
      <strong>Thorgrim Stonehammer</strong> is a dwarf fighter who grew up in the mountain fortress 
      of Karaz-a-Karak. As the third son of a respected smith, Thorgrim mastered the art of 
      metalworking before leaving home to seek adventure and glory.
    </p>
    <p>
      After witnessing the fall of an outlying dwarf settlement to orcish raiders, Thorgrim 
      took up the mantle of a protector. He now wanders the land, offering his axe to those 
      in need while searching for the legendary Forge of Souls, said to be capable of crafting 
      weapons that can slay even the mightiest dragons.
    </p>
    <h3>Personality Traits</h3>
    <p>
      Thorgrim is stubborn and proud of his heritage. He keeps a mental ledger of slights and 
      favors, never forgetting either. Despite his gruff exterior, he is fiercely loyal to 
      those who earn his trust.
    </p>
  </div>
);

// Combat information section
const CombatInfo = () => (
  <div className="combat-info">
    <h2>Combat Information</h2>
    <p><strong>Hit Points:</strong> 45 (Current: 38)</p>
    <p><strong>Armor Class:</strong> 18</p>
    <p><strong>Initiative:</strong> +2</p>
    <p><strong>Speed:</strong> 25 ft.</p>
    
    <h3>Special Abilities</h3>
    <ul>
      <li><strong>Second Wind:</strong> Once per short rest, regain 1d10+3 hit points as a bonus action.</li>
      <li><strong>Action Surge:</strong> Once per short rest, take an additional action.</li>
      <li><strong>Improved Critical:</strong> Score a critical hit on a roll of 19-20.</li>
    </ul>
  </div>
);

// RPG Two-Column Demo Page
export default function RPGPanelsDemo() {
  console.log("Rendering RPG Panels Demo");
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Head>
        <title>RPG Panels with Enhanced Tables Demo</title>
        <meta name="description" content="A demonstration of RPG-style panels with integrated tables" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root {
          --font-serif: 'EB Garamond', serif;
        }
      `}</style>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">RPG Panels with Enhanced Tables</h1>
        <p className="text-lg">A showcase of two-column layout RPG panels with integrated table components</p>
      </header>

      <main>
        {/* Character Sheet Panel */}
        <section className="rpg-panel">
          <div className="rpg-corner rpg-corner--tl"></div>
          <div className="rpg-corner rpg-corner--tr"></div>
          <div className="rpg-corner rpg-corner--bl"></div>
          <div className="rpg-corner rpg-corner--br"></div>
          
          <div className="rpg-panel__header">
            Character Sheet: Thorgrim Stonehammer
          </div>
          
          <div className="rpg-columns">
            <div className="rpg-column rpg-column--left">
              <div className="rpg-column__header">Character Attributes</div>
              
              <EnhancedTable 
                columns={statColumns}
                data={characterStats}
                style="rpg"
                zebra
                hover
                compact
              />
              
              <CharacterSkills />
            </div>
            
            <div className="rpg-column rpg-column--right">
              <div className="rpg-column__header">Character Details</div>
              
              <CharacterBackground />
              <CombatInfo />
            </div>
          </div>
        </section>

        {/* Equipment Panel */}
        <section className="rpg-panel">
          <div className="rpg-corner rpg-corner--tl"></div>
          <div className="rpg-corner rpg-corner--tr"></div>
          <div className="rpg-corner rpg-corner--bl"></div>
          <div className="rpg-corner rpg-corner--br"></div>
          
          <div className="rpg-panel__header">
            Equipment & Inventory
          </div>
          
          <div className="rpg-columns">
            <div className="rpg-column rpg-column--left">
              <div className="rpg-column__header">Equipped Items</div>
              
              <EnhancedTable 
                columns={equipmentColumns}
                data={equipment}
                style="rpg"
                zebra
                hover
                bordered
              />
            </div>
            
            <div className="rpg-column rpg-column--right">
              <div className="rpg-column__header">Inventory Details</div>
              
              <h2>Carrying Capacity</h2>
              <p>
                <strong>Current Weight:</strong> 71.5 lbs<br />
                <strong>Capacity:</strong> 240 lbs<br />
                <strong>Max Capacity:</strong> 480 lbs (Disadvantage on ability checks, saves, and attacks)
              </p>
              
              <h2>Currency</h2>
              <p>
                <strong>Gold:</strong> 124 gp<br />
                <strong>Silver:</strong> 56 sp<br />
                <strong>Copper:</strong> 32 cp
              </p>
              
              <h2>Special Items</h2>
              <ul>
                <li><strong>Dwarven Signet Ring</strong> - A family heirloom depicting the Stonehammer clan crest.</li>
                <li><strong>Map Fragment</strong> - A partial map that may lead to the Forge of Souls.</li>
                <li><strong>Lucky Stone</strong> - A smooth river stone that glows faintly in the presence of danger.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quest Panel */}
        <section className="rpg-panel">
          <div className="rpg-corner rpg-corner--tl"></div>
          <div className="rpg-corner rpg-corner--tr"></div>
          <div className="rpg-corner rpg-corner--bl"></div>
          <div className="rpg-corner rpg-corner--br"></div>
          
          <div className="rpg-panel__header">
            Active Quests
          </div>
          
          <div className="rpg-columns">
            <div className="rpg-column rpg-column--left">
              <div className="rpg-column__header">Main Quest</div>
              
              <h2>The Forge of Souls</h2>
              <p>
                Find the legendary Forge of Souls, said to be hidden deep within the 
                mountains of Karag Dron. The forge is capable of crafting weapons of 
                unimaginable power.
              </p>
              
              <h3>Current Objective</h3>
              <p>
                Speak with the sage Elminster in the city of Waterdeep. He may have 
                knowledge about the location of another map fragment.
              </p>
              
              <h3>Progress</h3>
              <ul>
                <li><strong>✓</strong> Recovered the first map fragment from the ruins of Karak Azgal</li>
                <li><strong>✓</strong> Decoded the ancient dwarven runes on the fragment</li>
                <li><strong>✓</strong> Learned of Elminster's knowledge from the merchant in Baldur's Gate</li>
                <li><strong>□</strong> Meet with Elminster in Waterdeep</li>
                <li><strong>□</strong> Find the second map fragment</li>
                <li><strong>□</strong> Locate the Forge of Souls</li>
              </ul>
            </div>
            
            <div className="rpg-column rpg-column--right">
              <div className="rpg-column__header">Side Quests</div>
              
              <h2>The Troubled Mine</h2>
              <p>
                The Iron Hills Mining Company has reported strange occurrences in their 
                newest mine shaft. Investigate the disturbances and secure the mine.
              </p>
              <p>
                <strong>Reward:</strong> 200 gold pieces and a masterwork mining pick
              </p>
              
              <h2>A Smith's Request</h2>
              <p>
                Master Smith Durgan needs rare fire salamander scales to forge a special 
                weapon. Collect 5 scales from the volcanic caverns to the east.
              </p>
              <p>
                <strong>Reward:</strong> Custom weapon enchantment
              </p>
              
              <h2>Lost Caravan</h2>
              <p>
                A merchant caravan disappeared while traveling through the Dark Forest. 
                Find the caravan and determine what happened to it.
              </p>
              <p>
                <strong>Reward:</strong> Merchant's gratitude and potential discount at shops
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">
            Note: This demo showcases RPG-style panels with a two-column layout and enhanced tables,
            perfect for character sheets, campaign management, and game interfaces.
          </p>
        </div>
      </main>
    </div>
  );
} 