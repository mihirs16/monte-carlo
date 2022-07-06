<script lang="ts">
    import Editor from "./lib/Editor.svelte";
    
    const getRoomID = (): string | false => {
        const paramsRaw = window.location.href.split('?');
        
        if (!paramsRaw[2]) return false;
        const paramsParse = new URLSearchParams(paramsRaw[2]);
        const roomID = paramsParse.get('roomid');
        
        if (!roomID) return false;
        else return roomID;
    };

    let roomID: string | false = getRoomID();
</script>

{#if roomID == false}
    <h1></h1>
{:else}
    <Editor roomID={roomID}/>
{/if}
