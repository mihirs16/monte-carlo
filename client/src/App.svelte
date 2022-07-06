<script lang="ts">

    // ui imports
    import "carbon-components-svelte/css/white.css";

    // component imports
    import Editor from "./lib/Editor.svelte";
    import Home from "./lib/Home.svelte";
   
    // get roomid from url
    const getRoomID = (): string | false => {
        const paramsRaw = window.location.href.split('?');
        
        if (!paramsRaw[1]) return false;
        const paramsParse = new URLSearchParams(paramsRaw[1]);
        const roomID = paramsParse.get('roomid');
        
        if (!roomID) return false;
        else return roomID;
    };
    let roomID: string | false = getRoomID();

</script>

{#if roomID == false}
    <Home />
{:else}
    <Editor roomID={roomID}/>
{/if}
