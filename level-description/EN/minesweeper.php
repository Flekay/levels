
<h1>Minesweeper Level Description</h1>
<p><strong>Overview:</strong> The Minesweeper level challenges the player with a grid-based field filled with hidden mines (represented by 'cauliflower'). The goal is to harvest cauliflowers by safely revealing all non-mine tiles.</p>

<p><strong>Grid Specifications:</strong></p>
<ul>
    <li>Grid Size: 16x16 tiles.</li>
    <li>Total Mines: 40 mines, placed randomly.</li>
</ul>

<p><strong>Gameplay Mechanics:</strong></p>
<ul>
    <li>Use the "till" function to reveal tiles; if a tile is safe and has no adjacent mines, neighboring tiles will also be revealed.</li>
    <li>Use the "measure" function to check the stage of neighboring tiles.</li>
    <li>If a mine is triggered by tilling or harvesting it before all non-mine tiles are revealed, the cauliflower will be destroyed</li>
    <li>Harvesting cauliflowers is only successful when all non-mine tiles are revealed.</li>
</ul>

<p><strong>Allowed Level Functions:</strong></p>
<ul>
    <li>clear( )</li>
    <li>move( < direction > )</li>
    <li>get_pos( )</li>
    <li>get_world_size( )</li>
    <li>till( )</li>
    <li>measure( < direction > )</li>
    <li>harvest( )</li>
</ul>

<p><strong>Leaderboard Goal:</strong></p>
<p>Successfully harvest 10,000 cauliflowers as quickly as possible to earn a spot on the leaderboard.</p>
