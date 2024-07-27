from gradio_client import Client, handle_file

client = Client("levihsu/OOTDiffusion")
result = client.predict(
		vton_img=handle_file('https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/2e0cca23e744c036b3905c4b6167371632942e1c/model_1.png'),
		garm_img=handle_file('https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/26049240/2023/11/25/a4d8f3d7-baf9-4bcf-99c9-9d7a086530ef1700883413306TokyoTalkiesWomenBlackSolidOpenFrontSlimFitCropCardigan1.jpg'),
		n_samples=1,
		n_steps=20,
		image_scale=2,
		seed=-1,
		api_name="/process_hd"
)
print(result)