module github.com/kubernetes/dashboard

go 1.12

require (
	github.com/docker/distribution v2.7.0+incompatible
	github.com/emicklei/go-restful v2.9.6+incompatible
	github.com/gogo/protobuf v1.3.1
	github.com/golang/glog v0.0.0-20160126235308-23def4e6c14b
	github.com/prometheus/client_golang v1.2.1
	github.com/spf13/pflag v1.0.5
	github.com/witesand/controller v0.0.0-00010101000000-000000000000
	github.com/witesand/dashboard v0.0.0
	github.com/witesand/sandbox2 v0.0.0-00010101000000-000000000000
	golang.org/x/net v0.0.0-20191209160850-c0dbc17a3553
	golang.org/x/text v0.3.2
	gopkg.in/igm/sockjs-go.v2 v2.0.0
	gopkg.in/square/go-jose.v2 v2.3.1
	gopkg.in/yaml.v2 v2.2.5
	k8s.io/api v0.17.2
	k8s.io/apiextensions-apiserver v0.17.2
	k8s.io/apimachinery v0.17.2
	k8s.io/client-go v0.17.2
	k8s.io/heapster v1.5.4
)

replace github.com/kubernetes/dashboard => ./

replace github.com/witesand/dashboard => ../sandbox2

replace github.com/witesand/sandbox2 => ../../witesand/sandbox2

replace github.com/wavesurf/sandbox2 => ../../../github.com/witesand/sandbox2

replace github.com/witesand/controller => ../controller

replace github.com/witesand/kine => ../kine
