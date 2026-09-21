
type CredentialsFormProps = {
  idInstance: string;
  apiTokenInstance: string;
    setInstanceId: (value: string) => void;
    setApiToken: (value: string) => void;
    apiUrl: string;
    setApiUrl: (value: string) => void;
    handleConnect: () => void;
    setError: (value: string) => void;
};

export default function CredentialsForm({idInstance, apiTokenInstance, setInstanceId, setApiToken, apiUrl ,setApiUrl, handleConnect, setError}: CredentialsFormProps) {

  return (
<>
    <div className='authorization'>
        <label htmlFor="apiUrl">API URL:</label>
        <input
        id='apiUrl'
        type="text"
        placeholder="Введите API URL..."
        value={apiUrl}
        onChange={(e)=>{
            setError('')
            setApiUrl(e.target.value)}}/>
        <label htmlFor="instanceId">ID Instance :</label>
        <input
        id='instanceId'
        type="text"
        placeholder="Введите ID Instance..."
        value={idInstance}
        onChange={(e) => {
            setError('')
            setInstanceId(e.target.value)}}
        />
        <label htmlFor="APItokenInstance">API Token:</label>
        <input
        id='APItokenInstance'
        type="password" placeholder="Введите API Token Instance..."
        value={apiTokenInstance}
        onChange={(e)=>{
            setError('')
            setApiToken(e.target.value)}}/>
    </div>
        <button 
        className='btn'
        onClick={handleConnect}
        >Подключиться</button>
</>
    
  )
}
