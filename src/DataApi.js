
class DataApi{
    static pageTokens=async (page)=>{
        let uri = "https://api.chineseoperamaskplus.com/assets/list/"+
            // let uri = "http://localhost:8080/assets/list/"+
            (page+1)+"/12";
        let res = await fetch(uri);
        return await res.json();
    }
    static fetchAddressTokens = async (address)=>{
        let uri = "https://api.chineseoperamaskplus.com/assets/address/"+address
        // let uri = "http://localhost:8080/assets/address/"+address
        let res = await fetch(uri);
        return await res.json();
    }
    static getAllStandard = async ()=>{
        let uri = "https://api.chineseoperamaskplus.com/assets/standard/list";
        // let uri = "http://localhost:8080/assets/standard/list";
        let res = await fetch(uri);
        return await res.json();

    }
}
export default DataApi
